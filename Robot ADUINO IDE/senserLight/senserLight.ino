#define Analog A0
#define Pin1 D3
#define Pin2 D4

void setup() {

  Serial.begin(9600);
  pinMode(Analog,INPUT);

  pinMode(Pin1,OUTPUT);
  pinMode(Pin2,OUTPUT);
  digitalWrite(Pin1,LOW);
  digitalWrite(Pin2,LOW);

}

void loop() {
  digitalWrite(Pin1,HIGH);
  delay(200);
  Serial.print("PIN1 Device is : ");
  Serial.println(1024-analogRead(Analog));
  delay(200);
  digitalWrite(Pin1,LOW);
  delay(2000);

  

}
