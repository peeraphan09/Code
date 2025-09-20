#include <SoftwareSerial.h>
SoftwareSerial mySerial(D2, D3);

#define M1A D0
#define M1B D1
#define M2A D6
#define M2B D4

void setup() {
  Serial.begin(9600);
  while (!Serial)
    ;
  mySerial.begin(9600);

  pinMode(M1A, OUTPUT);
  pinMode(M1B, OUTPUT);
  pinMode(M2A, OUTPUT);
  pinMode(M2B, OUTPUT);

  digitalWrite(M1A, LOW);
  digitalWrite(M1B, LOW);
  digitalWrite(M2A, LOW);
  digitalWrite(M2B, LOW);
}

void loop() {
  if (mySerial.available() > 0) {
    char command = mySerial.read();
    Serial.println(command); 

    if (command == 'U') { 
      moveForward();
    } else if (command == 'D') { 
      moveBackward();
    } else if (command == 'R') {
      turnLeft();
    } else if (command == 'L') { 
      turnRight();
    } else if (command == 'S') {
      stopMoving();
    }
  }

  if (Serial.available() > 0) {
    mySerial.write(Serial.read());
  }
}


void moveForward() {
  digitalWrite(M1A, HIGH);
  digitalWrite(M1B, LOW);
  digitalWrite(M2A, HIGH);
  digitalWrite(M2B, LOW);
}

void moveBackward() {
  digitalWrite(M1A, LOW);
  digitalWrite(M1B, HIGH);
  digitalWrite(M2A, LOW);
  digitalWrite(M2B, HIGH);
}

void turnLeft() {
  digitalWrite(M1A, LOW);
  digitalWrite(M1B, LOW);
  digitalWrite(M2A, HIGH);
  digitalWrite(M2B, LOW);
}

void turnRight() {
  digitalWrite(M1A, HIGH);
  digitalWrite(M1B, LOW);
  digitalWrite(M2A, LOW);
  digitalWrite(M2B, LOW);
}

void stopMoving() {
  digitalWrite(M1A, LOW);
  digitalWrite(M1B, LOW);
  digitalWrite(M2A, LOW);
  digitalWrite(M2B, LOW);
}
