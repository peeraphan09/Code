#define relayPin 5
#define analogPin A0
void setup() {
  pinMode(relayPin, OUTPUT);
  Serial.begin(9600);
}
int sensorValue = 0;
void loop() {
  sensorValue = analogRead(analogPin);
  Serial.println(sensorValue);
  if (sensorValue > 600) {
    digitalWrite(relayPin, LOW);
  } else if (sensorValue < 600) {
    digitalWrite(relayPin, HIGH);
  }
}