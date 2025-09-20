#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define Analog A0
#define Pin1 D3
#define Pin2 D4
#define Pin3 D5
#define Pin4 D6

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 32  // OLED display height, in pixels

#define OLED_RESET -1        // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C  ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(9600);

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(15, 10);
  display.print("CPE Digit");
  display.display();
  pinMode(Analog, INPUT);

  pinMode(Pin1, OUTPUT);
  pinMode(Pin2, OUTPUT);
  pinMode(Pin3, OUTPUT);
  pinMode(Pin4, OUTPUT);
  digitalWrite(Pin1, LOW);
  digitalWrite(Pin2, LOW);
  digitalWrite(Pin3, LOW);
  digitalWrite(Pin4, LOW);
}

void loop() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  digitalWrite(Pin1, HIGH);
  delay(200);
  display.setCursor(5, 5);
  display.print("R : ");
  display.setCursor(30, 5);
  display.print(1024 - analogRead(Analog));
  delay(200);
  digitalWrite(Pin1, LOW);
  delay(500);

  digitalWrite(Pin2, HIGH);
  delay(200);
  display.setCursor(5, 15);
  display.print("Light : ");
  display.setCursor(50, 15);
  display.print(1024 - analogRead(Analog));
  delay(200);
  digitalWrite(Pin2, LOW);
  delay(500);

  digitalWrite(Pin3, HIGH);
  delay(200);
  display.setCursor(5, 25);
  display.print("humi : ");
  display.setCursor(50, 25);
  display.print(1024 - analogRead(Analog));
  delay(200);
  digitalWrite(Pin3, LOW);
  delay(500);

  digitalWrite(Pin4, HIGH);
  delay(200);
  display.setCursor(60, 5);
  display.print("rain :");
  display.setCursor(100, 5);
  display.print(1024 - analogRead(Analog));
  delay(200);
  digitalWrite(Pin4, LOW);
  delay(2000);

  display.display();
}
