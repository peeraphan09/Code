#define redPin D0
#define yelloPin D1
#define greenPin D3
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(redPin, OUTPUT);
  pinMode(yelloPin, OUTPUT);
  pinMode(D3, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(redPin, HIGH);  // turn the LED on (HIGH is the voltage level)
  delay(300);                      // wait for a second
  digitalWrite(redPin, LOW);   // turn the LED off by making the voltage LOW
  delay(300);   

    digitalWrite(yelloPin, HIGH);  // turn the LED on (HIGH is the voltage level)
  delay(300);                      // wait for a second
  digitalWrite(yelloPin, LOW);   // turn the LED off by making the voltage LOW
  delay(300); 

    digitalWrite(greenPin, HIGH);  // turn the LED on (HIGH is the voltage level)
  delay(300);                      // wait for a second
  digitalWrite(greenPin, LOW);   // turn the LED off by making the voltage LOW
  delay(300);                    // wait for a second
}
