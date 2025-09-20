#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Ticker.h>
#include <Adafruit_Sensor.h>
#include <Servo.h>
#define SCREEN_WIDTH 124     // OLED display width, in pixels
#define SCREEN_HEIGHT 32     // OLED display height, in pixels
#define OLED_RESET -1        // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C  ///< See datasheet for Address; 0x3D for 124x64, 0x3C for 124x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define analog A0
#define yellow D5
#define red D6
#define R D9
#define fon D8
#define servoA D7
const int pingPin = D3; //t
int inPin = D4;  //e
long duration, cm;
long microsecondsToCentimeters(long microseconds) {

  return microseconds / 29 / 2;
}

Ticker timer250;
volatile bool timer250check = false;
void time250() {
  timer250check = true;
}
Ticker timer1000;
volatile bool timer1000check = false;
void time1000() {
  timer1000check = true;
}
Ticker timerfon;
volatile bool timerfoncheck = false;
void timefon() {
  timerfoncheck = true;
}

volatile bool yellow1 = false;
ICACHE_RAM_ATTR void yellowInterrupt() {
  yellow1 = true;
}
volatile bool red1 = false;
ICACHE_RAM_ATTR void redInterrupt() {
  red1 = true;
}

Servo myservo;
int mapvalue = 0;
int cServo;

void setup() {
  Serial.begin(9600);
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }

  pinMode(yellow, INPUT_PULLUP);
  pinMode(red, INPUT_PULLUP);

  pinMode(R, OUTPUT);
  pinMode(fon, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(yellow), yellowInterrupt, RISING);
  attachInterrupt(digitalPinToInterrupt(red), redInterrupt, RISING);
  display.clearDisplay();
  
  timer250.attach(0.25, time250);
  timer1000.attach(0.25, time1000);
  timerfon.attach(0.25, timefon);
  myservo.attach(servoA);

  // display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  // display.display();
  // display.clearDisplay();
}

int we = 28;
int fon1 = 0;
int R1 = 0;
// int loopCount = 100;

void loop() {
  
   mapvalue = map(cServo, 8, 1024, 0, 180);
  myservo.write(mapvalue);
  delay(10);

   pinMode(pingPin, OUTPUT);
   digitalWrite(pingPin, LOW);
   delayMicroseconds(2);
   digitalWrite(pingPin, HIGH);
   delayMicroseconds(5);
   digitalWrite(pingPin, LOW);
   pinMode(inPin, INPUT);
   duration = pulseIn(inPin, HIGH);
   cm = microsecondsToCentimeters(duration);
  if (timer250check) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 0);
    display.print("pornnapha");
    display.setCursor(60,10);
    display.print(" b:");
    display.print(we);

    display.setCursor(0,20);
    display.print("SET:");
    display.print(R1);
    display.setCursor(60,20);
    display.print("ANL:");
    display.print(fon1);

    display.setCursor(60,0);
    display.print(" BIN:");
    display.print(servoA);
    if (servoA < R) {
      display.print("OPE");
    } else {
      display.print("CLO");
    }

    display.setCursor(0,10);
    display.print("ULT:");
    display.print(cm);
    
    
    display.display();
    timer250check = false;
  }
   if (timer1000check) {
    if (yellow1) {
      if (we != 38){
        we = we + 1;
      } //else if(we == 38){
      //   we = we;
      // }
      yellow1 = false;
    }
    if (red1) {
      if (we != 18){
        we = we - 1;
      } //else if(we == 18){
      //   we = we;
      // }
      red1 = false;
    }
    timer1000check = false;
  }
  if (timerfoncheck) {
   // if  { (loopCount == 100)
      digitalWrite(fon, HIGH);
      delay(10);
      fon1 = 1024 - analogRead(analog);
      fon1 = map(fon1, 74, 495, 108, 208);
      Serial.println(fon1);
      digitalWrite(fon, LOW);
      delay(10);
      //loopCount = 200;
   // }
   // if {// (loopCount == 200 && digitalRead(fon) == LOW) 
      digitalWrite(R, HIGH);
      delay(10);
      R1 = (1024 - analogRead(analog));
      R1 = map(R1, 38, 1014, 18, 48);
      digitalWrite(R, LOW);
      delay(10);
      //loopCount = 100;
   // }
   if (cm < R ) {
      display.print("ON");
    } else {
      display.print("OFF");
    }

    timerfoncheck = false;
  }
 
}

