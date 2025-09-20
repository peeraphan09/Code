#include <Servo.h>

#define servoA D1
#define analogPin A0

Servo myservo;
int mapvalue = 0;
int cServo;

void setup() {
  myservo.attach(servoA);
  Serial.begin(9600);
}

void loop() {
  cServo = analogRead(analogPin);
  mapvalue = map(cServo, 13, 814, 0, 180);
  Serial.println(mapvalue);
  myservo.write(mapvalue);
  delay(10);
}