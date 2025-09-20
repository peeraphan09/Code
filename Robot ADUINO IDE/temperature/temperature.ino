#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>


#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 

#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);


#define DHTPIN 2    
#define DHTTYPE    DHT11  
DHT_Unified dht(DHTPIN, DHTTYPE);

const int pingPin = D5;
int inPin = D6;
long microsecondsToCentimeters(long microseconds)
{
// ความเร็วเสียงในอากาศประมาณ 340 เมตร/วินาที หรือ 29 ไมโครวินาที/เซนติเมตร
// ระยะทางที่ส่งเสียงออกไปจนเสียงสะท้อนกลับมาสามารถใช้หาระยะทางของวัตถุได้
// เวลาที่ใช้คือ ระยะทางไปกลับ ดังนั้นระยะทางคือ ครึ่งหนึ่งของที่วัดได้
return microseconds / 29 / 2;
}
void setup() {
    Serial.begin(9600);
    dht.begin();
    sensor_t sensor;
    dht.temperature().getSensor(&sensor);
    dht.humidity().getSensor(&sensor);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(15, 10);
  display.print("CPE Digit");
  display.display();
}
int count=0;
void loop() {
   float temp=0;
   float humi=0;

  sensors_event_t event;
  dht.temperature().getEvent(&event);
  temp=event.temperature;

  dht.humidity().getEvent(&event);
  humi=event.relative_humidity;

  long duration, cm;
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(pingPin, LOW);
  pinMode(inPin, INPUT);
  duration = pulseIn(inPin, HIGH);
  cm = microsecondsToCentimeters(duration);
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();

  count++;
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  display.setCursor(5, 5);
  display.print("Temp :");
  display.setTextSize(1);
  display.setCursor(50, 5);
  display.print(temp); 
  display.display();  

  display.setCursor(5, 15);
  display.print("Humi :");
  display.setTextSize(1);
  display.setCursor(50, 15);
  display.print(humi); 

   display.setCursor(5, 25);
  display.print("Range :");
  display.setTextSize(1);
  display.setCursor(50, 25);
  display.print(cm); 
  display.display(); 
  delay(1000);
}

