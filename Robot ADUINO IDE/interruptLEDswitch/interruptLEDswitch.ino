#define Analog A0
#define Pin1 D3
#define Pin2 D4
#define Pin3 D6
#define Pin4 D7

void setup() {

  Serial.begin(9600);
  pinMode(Analog,INPUT);

  pinMode(Pin1,OUTPUT);
  pinMode(Pin2,OUTPUT);
  pinMode(Pin3,OUTPUT);
   pinMode(Pin4,OUTPUT);
  digitalWrite(Pin1,LOW);
  digitalWrite(Pin2,LOW);
  digitalWrite(Pin3,LOW);

}

void loop() {
  digitalWrite(Pin1,HIGH);
  delay(200);
  Serial.print("PIN1 Device is : ");
  Serial.println(1024-analogRead(Analog));
  delay(200);
  digitalWrite(Pin1,LOW);
  delay(500);

  digitalWrite(Pin2,HIGH);
  delay(200);
  Serial.print("PIN2 Device is : ");
  Serial.println(1024-analogRead(Analog));
  delay(200);
  digitalWrite(Pin2,LOW);
  delay(500);

  digitalWrite(Pin3,HIGH);
  delay(200);
  Serial.print("PIN3 Device is : ");
  Serial.println(1024-analogRead(Analog));
  delay(200);
  digitalWrite(Pin3,LOW);
  delay(500);

  digitalWrite(Pin4,HIGH);
  delay(200);
  Serial.print("PIN4 Device is : ");
  Serial.println(1024-analogRead(Analog));
  delay(200);
  digitalWrite(Pin4,LOW);
  delay(2000);


  

}
