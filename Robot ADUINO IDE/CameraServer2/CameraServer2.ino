#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
#include <base64.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>

// Replace with your network credentials
const char* ssid = "oo";
const char* password = "12345678";

// InfluxDB details
#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "d7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA=="
#define INFLUXDB_ORG "86e5ce4e5a6c211e"
#define INFLUXDB_BUCKET "image"

#define CAMERA_MODEL_AI_THINKER

// Camera pin definitions for AI-Thinker ESP32-CAM module
#define Y2_GPIO_NUM 5
#define Y3_GPIO_NUM 18
#define Y4_GPIO_NUM 19
#define Y5_GPIO_NUM 21
#define Y6_GPIO_NUM 36
#define Y7_GPIO_NUM 39
#define Y8_GPIO_NUM 34
#define Y9_GPIO_NUM 35
#define XCLK_GPIO_NUM 0
#define PCLK_GPIO_NUM 22
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1

// Declare InfluxDB client instance with preconfigured InfluxCloud certificate
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);

// Create a web server on port 80
WebServer server(80);

void handleRoot() {
  String html = "<html><body><h1>ESP32-CAM</h1>"
                "<form action=\"/capture\" method=\"POST\">"
                "<input type=\"submit\" value=\"Capture Image\">"
                "</form></body></html>";
  server.send(200, "text/html", html);
}

void handleCapture() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    server.send(500, "text/plain", "Camera capture failed");
    return;
  }

  // Convert image to Base64
  String imageBase64 = base64::encode(fb->buf, fb->len);

  // Create InfluxDB data point
  Point imageData("image_data");
  imageData.addField("image_base64", imageBase64);

  // Write data to InfluxDB
  if (!client.writePoint(imageData)) {
    Serial.print("InfluxDB write failed: ");
    Serial.println(client.getLastErrorMessage());
    server.send(500, "text/plain", "Failed to write to InfluxDB");
  } else {
    Serial.println("Image data sent successfully");
    server.send(200, "text/plain", "Image captured and sent to InfluxDB");
  }

  // Return the frame buffer back to the driver for reuse
  esp_camera_fb_return(fb);
}

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Synchronize time using NTP
  configTime(0, 0, "pool.ntp.org");
  if (!client.validateConnection()) {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
    return;
  }
  Serial.println("Connected to InfluxDB");

  // Initialize the camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 30;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 30;
    config.fb_count = 1;
  }

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  // Start the web server
  server.on("/", HTTP_GET, handleRoot);
  server.on("/capture", HTTP_POST, handleCapture);
  server.begin();
}

void loop() {
  server.handleClient();
}
