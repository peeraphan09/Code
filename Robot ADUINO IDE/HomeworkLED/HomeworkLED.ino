#include <Ticker.h>

#define LEDRED D1
#define redKey D2
#define LEDYELLOW D4
#define YellowKey D5
#define LEDGREEN D3
#define GreenKey D7


Ticker timer500;
Ticker timer1000;
Ticker timer250;

volatile bool timer1000check = false;

void time1000() {
  timer1000check = true;
}

volatile bool timer500check = false;

void time500() {
  timer500check = true;
}

volatile bool timer250check = false;

void time250() {
  timer250check = true;
}

volatile bool red1 = false;

ICACHE_RAM_ATTR void redInterrupt() {
  red1 = true;
}

volatile bool Yellow1 = false;

ICACHE_RAM_ATTR void YellowInterrupt() {
  Yellow1 = true;
}

volatile bool Green1 = false;
volatile bool stopTimer500 = false;

ICACHE_RAM_ATTR void GreenInterrupt() {
  Green1 = true;
  stopTimer500 = true;
}

void setup() {
  Serial.begin(9600);
  Serial.println("Hello World");
  pinMode(LEDRED, OUTPUT);
  pinMode(LEDYELLOW, OUTPUT);
  pinMode(LEDGREEN, OUTPUT);

  pinMode(redKey, INPUT_PULLUP);
  pinMode(YellowKey, INPUT_PULLUP);
  pinMode(GreenKey, INPUT_PULLUP);

  digitalWrite(LEDRED, 0);
  digitalWrite(LEDYELLOW, 1);
  digitalWrite(LEDGREEN, 0);

  attachInterrupt(digitalPinToInterrupt(redKey), redInterrupt, RISING);
  attachInterrupt(digitalPinToInterrupt(YellowKey), YellowInterrupt, RISING);
  attachInterrupt(digitalPinToInterrupt(GreenKey), GreenInterrupt, RISING);

  timer500.attach(0.5, time500);
  timer1000.attach(1, time1000);
  timer250.attach(0.25, time250);
}

int loop500 = 1;
int redmode = 0;

int loop1000 = 1;
int greenmode = 0;

int loop250 = 1;
int yellowmode = 0;
int loopGreen = 0;
int loopYellow = 0;
int loopRed = 0;



void loop() {
  if (red1) {
    Serial.println("RED SWITCH!");
    redmode = 1;
    red1 = false;
    timer500.attach(0.5, time500);
    timer1000.detach();
    timer250.detach();
  }
  if (timer500check && redmode == 1) {
    Serial.println("TIMER 500");
    if (loop500 == 1) {
      digitalWrite(LEDYELLOW, 1);
      digitalWrite(LEDRED, 0);
      digitalWrite(LEDGREEN, 0);
      loop500 = 2;
    } else if (loop500 == 2) {
      digitalWrite(LEDYELLOW, 0);
      digitalWrite(LEDRED, 1);
      digitalWrite(LEDGREEN, 0);
      loop500 = 3;
    } else if (loop500 == 3) {
      digitalWrite(LEDYELLOW, 0);
      digitalWrite(LEDRED, 0);
      digitalWrite(LEDGREEN, 1);
      loop500 = 1;
    }
    timer500check = false;
  }

  if (Green1) {
    Serial.println("Green SWITCH!");
    greenmode = 1;
    Green1 = false;
    timer500.detach();
    timer250.detach();
    timer1000.attach(1, time1000);
  }
  if (timer1000check && greenmode == 1) {
    Serial.println("TIMER 1000");
    if (loop1000 == 1) {
      digitalWrite(LEDYELLOW, 1);
      digitalWrite(LEDRED, 0);
      digitalWrite(LEDGREEN, 0);
      loop1000 = 2;
    } else if (loop1000 == 2) {
      digitalWrite(LEDYELLOW, 0);
      digitalWrite(LEDRED, 0);
      digitalWrite(LEDGREEN, 1);
      loop1000 = 3;
    } else if (loop1000 == 3) {
      digitalWrite(LEDYELLOW, 0);
      digitalWrite(LEDRED, 1);
      digitalWrite(LEDGREEN, 0);
      loop1000 = 1;
    }
    timer1000check = false;
  }
  if (Yellow1) {
    Serial.println("Yellow SWITCH!");
    yellowmode = 1;
    Yellow1 = false;
    loopGreen = 1;
    loopRed = 1;
    loopYellow = 1;
    timer250.attach(0.25, time250);
    timer500.detach();
    timer1000.detach();
  }

  if (timer250check && yellowmode == 1) {
    Serial.println("TIMER 250");
    if (loop250 == 1) {
      if (digitalRead(LEDGREEN) == HIGH && loopGreen == 1) {
        digitalWrite(LEDGREEN, LOW);
        loopGreen = 2;
      } else if (loopGreen == 2) {
        digitalWrite(LEDGREEN, HIGH);
        loopGreen = 1;
      } else if (digitalRead(LEDRED) == HIGH && loopRed == 1) {
        digitalWrite(LEDRED, LOW);
        loopRed = 2;
      } else if (loopRed == 2) {
        digitalWrite(LEDRED, HIGH);
        loopRed = 1;
      } else if (digitalRead(LEDYELLOW) == HIGH && loopYellow == 1) {
        digitalWrite(LEDYELLOW, LOW);
        loopYellow = 2;
      } else if (loopYellow == 2) {
        digitalWrite(LEDYELLOW, HIGH);
        loopYellow = 1;
      }
    }
    loop250 = 1;
    timer250check = false;
  }
}