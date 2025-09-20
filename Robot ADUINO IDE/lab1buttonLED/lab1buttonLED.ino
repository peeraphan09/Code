#define redPin D0
#define K1Pin D5
#define yellowPin D1
#define K2Pin D3
void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(K1Pin, INPUT);

  pinMode(yellowPin, OUTPUT);
  pinMode(K2Pin, INPUT);

  digitalWrite(redPin, LOW);
  digitalWrite(yellowPin, LOW);
}

void loop() {
  if(digitalRead(K1Pin) == HIGH){
    digitalWrite(redPin, LOW);
  }

  if(digitalRead(K1Pin) == LOW){
    digitalWrite(redPin, LOW);
    delay(300); 
    digitalWrite(redPin, HIGH);
    delay(300); 
  }
    if(digitalRead(K2Pin) == HIGH){
    digitalWrite(yellowPin, LOW);
  }

  if(digitalRead(K2Pin) == LOW){
    digitalWrite(yellowPin, LOW);
    delay(300); 
    digitalWrite(yellowPin, HIGH);
    delay(300); 
  }
}
