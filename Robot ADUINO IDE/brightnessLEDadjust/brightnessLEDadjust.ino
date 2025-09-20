// #define redPin D1
// #define yelPin D2
#define redPin D3
#define analogPin A0

int sensorValue = 0;
int mapValue = 0;


void setup() {
  pinMode(redPin,OUTPUT);
  // pinMode(yelPin,OUTPUT);
  // pinMode(greenPin,OUTPUT);
  Serial.begin(9600);
 

}

void loop() {
  sensorValue = analogRead(analogPin);

  Serial.println(sensorValue);
  analogWrite(redPin,sensorValue);
  analogWrite(redPin,mapValue);
  mapValue = map(sensorValue,13,1024,0,1024);
  // analogWrite(yelPin,sensorValue);
  // analogWrite(greenPin,sensorValue);

  delay(10);

}
