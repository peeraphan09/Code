#define ANALOG A0
#define LED D0
int value = 0;
int mapvalue = 0;
#include <Ticker.h>
Ticker count_time1;
volatile bool inttimer=false;

void c_time(){
  inttimer=true;
}
void setup() {
  Serial.begin(9600);
  pinMode(LED,OUTPUT);

  count_time1.attach(1, c_time);
}

void loop() {
  // value = analogRead(ANALOG);
  // Serial.println(value);
  // mapvalue = map(value,14,1024,100,2000);
  // Serial.println(mapvalue);

  // digitalWrite(LED,HIGH);
  // delay(mapvalue);

  // digitalWrite(LED,LOW);
  // delay(mapvalue);
  if (inttimer) {
    Serial.println(analogRead(A0));
    inttimer=false;
  }

}
