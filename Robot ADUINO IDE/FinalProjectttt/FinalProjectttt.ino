#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
#include <base64.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>
#include <HTTPUpdate.h> 
#include <HTTPClient.h> 
#include <EEPROM.h>
#include <WiFiMulti.h>
#include <TimeLib.h>
#include <WiFiMulti.h>

#include <Ticker.h>
#include <Time.h>


struct settings {
  char ssid[30];
  char password[30];
  char email[30];
} user_wifi = {};

const char* HOST = "cpeiot.thesaban.org";
const int PORT = 80;
const char* URL = "/iot/image_data";


Ticker  count_time1;
Ticker  count_time2;

#define BUTTON_PIN 14  // ปุ่มกดที่ GPIO14

// กำหนดค่า WiFi
const char* ssid = "oo";
const char* password = "12345678";

const int buttonPin = 13;  // GPIO 13 is used for the button
const int interruptPin = 26; 
const int bluePin = 25;
const int redPin = 35;
const int greenPin = 32;
#define MODEL "image_data"
#define VERSION "2"

int modeButton = 1;
int RUNMODE = 0;
int timezone = 7 * 3600;
int dst = 0;
String datetime = "";
byte mac[6];
String str_mac = "";

unsigned long previousMillis = 0;
const long interval = 1000;  

bool inttimer = false;
bool greenvalue = false;
bool inttimer2 = false;
bool bluevalue = false;
bool redvalue = false;  

void c_time(){
 inttimer=true;
}

void c2_time(){
 inttimer2=true;
}

String macToStr(const uint8_t* mac) {
  String result;
  for (int i = 0; i < 6; ++i) {
    result += String(mac[i], HEX);
    if (i < 5)
      result += ':';
  }
  return result;
}


// กำหนดค่า InfluxDB
#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "d7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA=="
#define INFLUXDB_ORG "86e5ce4e5a6c211e"
#define INFLUXDB_BUCKET "image"

WebServer server(80);
WiFiMulti wifiMulti;
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
Point imageData("image_data");

volatile bool take_picture = false;
unsigned long lastCaptureTime = 0;  // เวลาครั้งสุดท้ายที่ถ่ายภาพ

//  **ประกาศค่ากล้องสำหรับ ESP32-CAM AI-THINKER**
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

void IRAM_ATTR buttonPressed() {
    take_picture = true;
}

// void handlePortal() {
//   if (server.method() == HTTP_POST) {
//     strncpy(user_wifi.ssid, server.arg("ssid").c_str(), sizeof(user_wifi.ssid));
//     strncpy(user_wifi.password, server.arg("password").c_str(), sizeof(user_wifi.password));
//     strncpy(user_wifi.email, server.arg("email").c_str(), sizeof(user_wifi.email));
//     user_wifi.ssid[server.arg("ssid").length()] = user_wifi.password[server.arg("password").length()] = user_wifi.email[server.arg("email").length()] = '\0';

//     EEPROM.put(0, user_wifi);
//     EEPROM.commit();

//     server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />Please change mode and restart the device.</p></main></body></html>");
//   } else {
//     server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title> <style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{cursor: pointer;border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1{text-align: center}</style> </head> <body><main class='form-signin'> <form action='/' method='post'> <h1 class=''>Wifi Setup (" + str_mac + ") </h1><br/><div class='form-floating'><label>SSID</label><input type='text' class='form-control' name='ssid'> </div><div class='form-floating'><br/><label>Password</label><input type='password' class='form-control' name='password'></div><br/><div class='form-floating'><label>Email</label><input type='text' class='form-control' name='email'> </div><br/><br/><button type='submit'>Save</button><p style='text-align: right'><a href='https://www.thesaban.org' style='color: #32C5FF'>thesaban.org</a></p></form></main> </body></html>");
//   }
// }

void handlePortal() {
  if (server.method() == HTTP_POST) {
    strncpy(user_wifi.ssid, server.arg("ssid").c_str(), sizeof(user_wifi.ssid));
    strncpy(user_wifi.password, server.arg("password").c_str(), sizeof(user_wifi.password));
    strncpy(user_wifi.email, server.arg("email").c_str(), sizeof(user_wifi.email));
    user_wifi.ssid[server.arg("ssid").length()] = user_wifi.password[server.arg("password").length()] = user_wifi.email[server.arg("email").length()] = '\0';

    EEPROM.put(0, user_wifi);
    EEPROM.commit();

    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />Please change mode and restart the device.</p></main></body></html>");
  } else {
    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title> <style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{cursor: pointer;border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1{text-align: center}</style> </head> <body><main class='form-signin'> <form action='/' method='post'> <h1 class=''>Wifi Setup (" + str_mac + ") </h1><br/><div class='form-floating'><label>SSID</label><input type='text' class='form-control' name='ssid'> </div><div class='form-floating'><br/><label>Password</label><input type='password' class='form-control' name='password'></div><br/><div class='form-floating'><label>Email</label><input type='text' class='form-control' name='email'> </div><br/><br/><button type='submit'>Save</button><p style='text-align: right'><a href='https://www.thesaban.org' style='color: #32C5FF'>thesaban.org</a></p></form></main> </body></html>");
  }
}


void setupInfluxDB() {
  if (!client.validateConnection()) {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
    return;
  }
  Serial.println("Connected to InfluxDB");
}
void influx(){
 imageData.clearFields(); 
 imageData.addField("rssi", WiFi.RSSI()); 
 
 Serial.println(imageData.toLineProtocol()); 
 if (!client.writePoint(imageData)) { 
    Serial.print("InfluxDB write failed: "); 
    Serial.println(client.getLastErrorMessage()); 
  }   
}

void update() {
  WiFiClient client;
  Serial.println(F("Update start now!"));
  t_httpUpdate_return ret = httpUpdate.update(client, HOST, PORT, URL, VERSION);

  switch (ret) {
    case HTTP_UPDATE_FAILED:
      Serial.printf("HTTP_UPDATE_FAILED Error (%d): %s\n", httpUpdate.getLastError(), httpUpdate.getLastErrorString().c_str());
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("Your code is up to date!");
      break;
    case HTTP_UPDATE_OK:
      Serial.println("HTTP_UPDATE_OK");
      delay(1000);  // Wait a second and restart
      ESP.restart();
      break;
  }
}

void influxRegister(){
  imageData.clearFields();
  imageData.addField("register",1);
  imageData.addField("rssi", WiFi.RSSI()); 
 
 Serial.println(imageData.toLineProtocol()); 
 if (!client.writePoint(imageData)) { 
    Serial.print("InfluxDB write failed: "); 
    Serial.println(client.getLastErrorMessage()); 
  }   
}

String getDate() {
  time_t now = time(nullptr);
  struct tm* p_tm = localtime(&now);
  char buffer[40];
  sprintf(buffer,"%u/%u/%u %u:%u:%u",p_tm->tm_mday,(p_tm->tm_mon+1),(p_tm->tm_year+1900),p_tm->tm_hour,p_tm->tm_min,p_tm->tm_sec);
  return buffer;
}
// void setup() {
//     Serial.begin(115200);
//     EEPROM.begin(sizeof(struct settings));
//     EEPROM.get(0, user_wifi);
//     WiFi.begin(ssid, password);

//     pinMode(buttonPin, INPUT_PULLUP);
//   pinMode(interruptPin, INPUT_PULLUP);

//   delay(250);
//   Serial.print("Mode Read : ");
//   Serial.println(digitalRead(buttonPin));

//   pinMode(bluePin, OUTPUT);
//   pinMode(redPin, OUTPUT);
//   pinMode(greenPin, OUTPUT);

//   digitalWrite(bluePin, bluevalue);
//   digitalWrite(redPin, redvalue);
//   digitalWrite(greenPin, greenvalue);

//   modeButton = digitalRead(buttonPin);
//   Serial.print("Mode Button State: ");
//   Serial.println(modeButton);

//   if (!modeButton) {  // เปิดโหมด AP
//     WiFi.macAddress(mac);
//     str_mac += macToStr(mac);

//     String APname = "ESP32-CAM" + str_mac;

//     Serial.println("WIFI AP MODE");
//     WiFi.softAP(APname, "mirot.digit");

//     Serial.print("IP Address (AP Mode): ");
//     Serial.println(WiFi.softAPIP());

//     Serial.println("HTTP server started");
//     server.on("/", HTTP_GET, handlePortal);
//     server.begin();
//     digitalWrite(bluePin, HIGH);
//     digitalWrite(redPin, HIGH);
//     digitalWrite(greenPin, HIGH);
//     RUNMODE = 1;
//   } else {  // โหมด Station (STA)
//     WiFi.mode(WIFI_STA);
//     wifiMulti.addAP(user_wifi.ssid, user_wifi.password);
//     Serial.print(user_wifi.ssid);
//     Serial.print(user_wifi.password);
//     Serial.print("Connecting to wifi");
//     while (wifiMulti.run() != WL_CONNECTED) {
//       Serial.print(".");
//       for (int i = 0; i <= 4; i++) {
//         digitalWrite(bluePin, LOW);
//         delay(200);
//         digitalWrite(bluePin, HIGH);
//         delay(200);
//       }
//     }

//     Serial.println("Connected to WiFi");

//     Serial.print("IP Address (STA Mode): ");
//     Serial.println(WiFi.localIP());

//     configTime(0, 0, "pool.ntp.org");

//     WiFi.macAddress(mac);
//     str_mac += macToStr(mac);
//     Serial.println(str_mac);
//     Serial.println(user_wifi.email);

//     imageData.addTag("model", MODEL); 
//     imageData.addTag("version", VERSION); 
//     imageData.addTag("device", str_mac); 
//     imageData.addTag("email", user_wifi.email); 
//     delay(200);
    
//     influxRegister();

//     count_time1.attach(2, c_time);
//     count_time2.attach(60, c2_time);
//   }

//     //  **ตั้งค่ากล้อง**
//     camera_config_t config;
//     config.ledc_channel = LEDC_CHANNEL_0;
//     config.ledc_timer = LEDC_TIMER_0;
//     config.pin_d0 = Y2_GPIO_NUM;
//     config.pin_d1 = Y3_GPIO_NUM;
//     config.pin_d2 = Y4_GPIO_NUM;
//     config.pin_d3 = Y5_GPIO_NUM;
//     config.pin_d4 = Y6_GPIO_NUM;
//     config.pin_d5 = Y7_GPIO_NUM;
//     config.pin_d6 = Y8_GPIO_NUM;
//     config.pin_d7 = Y9_GPIO_NUM;
//     config.pin_xclk = XCLK_GPIO_NUM;
//     config.pin_pclk = PCLK_GPIO_NUM;
//     config.pin_vsync = VSYNC_GPIO_NUM;
//     config.pin_href = HREF_GPIO_NUM;
//     config.pin_sscb_sda = SIOD_GPIO_NUM;
//     config.pin_sscb_scl = SIOC_GPIO_NUM;
//     config.pin_pwdn = PWDN_GPIO_NUM;
//     config.pin_reset = RESET_GPIO_NUM;
//     config.xclk_freq_hz = 20000000;
//     config.pixel_format = PIXFORMAT_JPEG;

// if (psramFound()) {
//     config.frame_size = FRAMESIZE_VGA;  // ใช้ความละเอียด 640x480
//     config.jpeg_quality = 10;  // ค่า JPEG quality (ค่ายิ่งต่ำ คุณภาพยิ่งสูง)
//     config.fb_count = 2;  // ใช้ buffer 2 เฟรมเพื่อประสิทธิภาพที่ดีขึ้น
// } else {
//     config.frame_size = FRAMESIZE_QQVGA;  // ใช้ 160x120 ถ้าไม่มี PSRAM
//     config.jpeg_quality = 12;
//     config.fb_count = 1;
// }

//     if (esp_camera_init(&config) != ESP_OK) {
//         Serial.println("Camera init failed");
//         return;
//     }
//     Serial.println("Camera Ready");

//     while (WiFi.status() != WL_CONNECTED) {
//         delay(1000);
//         Serial.println("Connecting to WiFi...");
//     }
//     Serial.println("Connected to WiFi");

//     configTime(0, 0, "pool.ntp.org");
//     if (!client.validateConnection()) {
//         Serial.print("InfluxDB connection failed: ");
//         Serial.println(client.getLastErrorMessage());
//     } else {
//         Serial.println("Connected to InfluxDB");
//     }

//     pinMode(BUTTON_PIN, INPUT_PULLUP);
//     attachInterrupt(BUTTON_PIN, buttonPressed, FALLING);

//     server.begin();
//     Serial.println("Web server started");
// }

void setup() {
    Serial.begin(115200);
    EEPROM.begin(sizeof(struct settings));
    EEPROM.get(0, user_wifi);
    
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(interruptPin, INPUT_PULLUP);
    delay(250);
    Serial.print("Mode Read : ");
    Serial.println(digitalRead(buttonPin));

    pinMode(bluePin, OUTPUT);
    pinMode(redPin, OUTPUT);
    pinMode(greenPin, OUTPUT);

    digitalWrite(bluePin, bluevalue);
    digitalWrite(redPin, redvalue);
    digitalWrite(greenPin, greenvalue);

    modeButton = digitalRead(buttonPin);
    Serial.print("Mode Button State: ");
    Serial.println(modeButton);

    if (!modeButton) {  // โหมด AP
        WiFi.disconnect();  // ตัดการเชื่อมต่อ WiFi ก่อน
        WiFi.macAddress(mac);
        str_mac = macToStr(mac);

        String APname = "ESP32-CAM" + str_mac;

        Serial.println("WIFI AP MODE");
        WiFi.softAP(APname.c_str(), "mirot.digit");

        Serial.println("AP Mode Started!");
        Serial.print("AP IP Address: ");
        Serial.println(WiFi.softAPIP());

        server.on("/", HTTP_GET, handlePortal);  // เปิดหน้าตั้งค่า WiFi
        server.begin();  // เริ่ม WebServer
        digitalWrite(bluePin, HIGH);
        digitalWrite(redPin, HIGH);
        digitalWrite(greenPin, HIGH);
        RUNMODE = 1;
    } else {  // โหมด Station (STA)
        WiFi.mode(WIFI_STA);
        wifiMulti.addAP(user_wifi.ssid, user_wifi.password);
        Serial.print("Connecting to WiFi");
        while (wifiMulti.run() != WL_CONNECTED) {
            Serial.print(".");
            for (int i = 0; i <= 4; i++) {
                digitalWrite(bluePin, LOW);
                delay(200);
                digitalWrite(bluePin, HIGH);
                delay(200);
            }
        }

        Serial.println("Connected to WiFi");
        Serial.print("IP Address (STA Mode): ");
        Serial.println(WiFi.localIP());

        configTime(0, 0, "pool.ntp.org");

        WiFi.macAddress(mac);
        str_mac = macToStr(mac);
        Serial.println(str_mac);
        Serial.println(user_wifi.email);

        influxRegister();
        count_time1.attach(2, c_time);
        count_time2.attach(60, c2_time);
    }

    // ตั้งค่ากล้อง
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
        config.jpeg_quality = 10;
        config.fb_count = 2;
    } else {
        config.frame_size = FRAMESIZE_QQVGA;
        config.jpeg_quality = 12;
        config.fb_count = 1;
    }

    if (esp_camera_init(&config) != ESP_OK) {
        Serial.println("Camera init failed");
        return;
    }
    Serial.println("Camera Ready");

    pinMode(BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(BUTTON_PIN, buttonPressed, FALLING);
    
    Serial.println("Web server started");
}


//  **ฟังก์ชันถ่ายภาพ**
void captureAndSendImage() {
    Serial.println("Capturing image...");

    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("Camera capture failed");
        return;
    }

    String imageBase64 = base64::encode(fb->buf, fb->len);
    esp_camera_fb_return(fb);

    Point imageData("image_data");
    imageData.addField("image_base64", imageBase64);

    if (!client.writePoint(imageData)) {
        Serial.print("InfluxDB write failed: ");
        Serial.println(client.getLastErrorMessage());
    } else {
        Serial.println("Image data sent successfully");
        Serial.println("Capture success");
    }
}

void loop() {
    server.handleClient();

    // ถ่ายภาพทุก 60 วินาที
    if (millis() - lastCaptureTime >= 60000) {
        lastCaptureTime = millis();
        captureAndSendImage();
    }

    // ตรวจสอบการกดปุ่ม
    if (take_picture) {
        take_picture = false;
        captureAndSendImage();
    }
}
