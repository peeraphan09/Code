#define LEDred D0
#define LEDyellow D1
#define LEDgreen D2 

#define SWred D3
#define SWyellow D4
#define SWgreen D5

#include <Ticker.h>
Ticker timer500;
volatile bool redcheck=false;
volatile bool yellowcheck=false;
volatile bool greencheck=false;
volatile bool timer500check=false;

void time500(){
  timer500check=true;
}

ICACHE_RAM_ATTR void redInterrupt(){
  redcheck=true;
}
ICACHE_RAM_ATTR void yellowInterrupt(){
  yellowcheck=true;
}
ICACHE_RAM_ATTR void greenInterrupt(){
  greencheck=true;
}

void setup() {

  Serial.begin(9600);
  Serial.println("Hello Word!");
  pinMode(LEDred, OUTPUT);
  pinMode(LEDyellow, OUTPUT);
  pinMode(LEDgreen, OUTPUT);

  pinMode(SWred, INPUT);
  pinMode(SWyellow, INPUT);
  pinMode(SWgreen, INPUT);
 
  digitalWrite(LEDred,0);
  digitalWrite(LEDyellow,1);
  digitalWrite(LEDgreen,0);

  attachInterrupt(digitalPinToInterrupt(SWred), redInterrupt,RISING);
  attachInterrupt(digitalPinToInterrupt(SWyellow), yellowInterrupt,RISING);
  attachInterrupt(digitalPinToInterrupt(SWgreen), greenInterrupt,RISING);
  timer500.attach(0.5, time500);
}
 int mode=0;
 int ledrun=1;

void loop() {
  if (redcheck) {
    Serial.println("RED SWITCH!");
    redcheck = false;
    ledrun = 1; // เมื่อกดสวิตช์สีแดง ให้เริ่มทำงานตามลำดับ
  }
  if (yellowcheck) {
    Serial.println("YELLOW SWITCH!");
    yellowcheck = false;
  }
  if (greencheck) {
    Serial.println("GREEN SWITCH!");
    greencheck = false;
  }
  if (timer500check && ledrun > 0) {
    Serial.println("TIMER 500");
    if (ledrun == 1) {
      digitalWrite(LEDyellow, 1);
      digitalWrite(LEDred, 0);
      digitalWrite(LEDgreen, 0);
      ledrun = 2;
    } else if (ledrun == 2) {
      digitalWrite(LEDyellow, 0);
      digitalWrite(LEDred, 1);
      digitalWrite(LEDgreen, 0);
      ledrun = 3;
    } else if (ledrun == 3) {
      digitalWrite(LEDyellow, 0);
      digitalWrite(LEDred, 0);
      digitalWrite(LEDgreen, 1);
      ledrun = 1; // ทำงานวนลูป
    }
    timer500check = false;
  }
}

