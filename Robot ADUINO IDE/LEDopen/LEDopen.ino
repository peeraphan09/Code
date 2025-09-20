#define redPin D0
#define K1Pin D5
#define yellowPin D1
#define K2Pin D3

int redVal = 0;
int yelVal = 0;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(K1Pin, INPUT_PULLUP);

  pinMode(yellowPin, OUTPUT);
  pinMode(K2Pin, INPUT_PULLUP);

}

void loop() {
  if(digitalRead(K1Pin) == LOW){
    redVal=!redVal;
    delay(200);   
  }
    if(digitalRead(K2Pin) == LOW){
    yelVal=!yelVal;
    delay(200);  
    }
digitalWrite(redPin, redVal);
digitalWrite(yellowPin, yelVal);
}
