#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
#include <base64.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>

#define BUTTON_PIN 14  // ปุ่มกดที่ GPIO14

// กำหนดค่า WiFi
const char* ssid = "iPhone";
const char* password = "12345678";

// กำหนดค่า InfluxDB
#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "d7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA=="
#define INFLUXDB_ORG "86e5ce4e5a6c211e"
#define INFLUXDB_BUCKET "image"

InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
WebServer server(80);

volatile bool take_picture = false;  // ตัวแปร flag ใช้กับ Interrupt

// 🟢 **ประกาศค่ากล้องสำหรับ ESP32-CAM AI-THINKER**
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

// ฟังก์ชันที่เรียกเมื่อกดปุ่ม
void IRAM_ATTR buttonPressed() {
    take_picture = true;
}

void setup() {
    Serial.begin(115200);

    // 🟢 **ตั้งค่ากล้อง**
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

    // ลดขนาดภาพให้เหมาะสม
    if (psramFound()) {
        config.frame_size = FRAMESIZE_QVGA; // 320x240
        config.jpeg_quality = 10; // คุณภาพปานกลาง
        config.fb_count = 2;
    } else {
        config.frame_size = FRAMESIZE_QQVGA; // 160x120 (ใช้ RAM น้อย)
        config.jpeg_quality = 12;
        config.fb_count = 1;
    }

    // เริ่มต้นกล้อง
    if (esp_camera_init(&config) != ESP_OK) {
        Serial.println("Camera init failed");
        return;
    }
    Serial.println("Camera Ready");

    // เชื่อมต่อ WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    // เชื่อมต่อ InfluxDB
    configTime(0, 0, "pool.ntp.org");
    if (!client.validateConnection()) {
        Serial.print("InfluxDB connection failed: ");
        Serial.println(client.getLastErrorMessage());
    } else {
        Serial.println("Connected to InfluxDB");
    }

    // ตั้งค่า GPIO14 เป็น input พร้อม pull-up
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(BUTTON_PIN, buttonPressed, FALLING);

    // ตั้งค่า Web Server
    server.begin();
}

// 🟢 **ฟังก์ชันถ่ายภาพ**
void captureAndSendImage() {
    Serial.println("Capturing image...");

    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("Camera capture failed");
        return;
    }

    // แปลงภาพเป็น Base64
    String imageBase64 = base64::encode(fb->buf, fb->len);
    esp_camera_fb_return(fb);

    // ส่งข้อมูลไปยัง InfluxDB
    Point imageData("image_data");
    imageData.addField("image_base64", imageBase64);

    if (!client.writePoint(imageData)) {
        Serial.print("InfluxDB write failed: ");
        Serial.println(client.getLastErrorMessage());
    } else {
        Serial.println("Image data sent successfully");
    }
}

void loop() {
    server.handleClient();

    if (take_picture) {
        take_picture = false;
        captureAndSendImage();
    }
}
