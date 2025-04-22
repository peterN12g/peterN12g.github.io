const int buttonPin = 2;
const int buttonPin2 = 3;
const int ledPin = 13;
const int ledPin2 = 12;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(buttonPin2, INPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  int buttonState2 = digitalRead(buttonPin2);

  if (buttonState == HIGH) {
    unsigned long startTime = millis();
    while (millis() - startTime < 3000) {
      digitalWrite(ledPin, HIGH);
      digitalWrite(ledPin2, LOW);
      delay(500);
      digitalWrite(ledPin, LOW);
      digitalWrite(ledPin2, HIGH);
      delay(500);
    }
  } 
  else if (buttonState2 == HIGH) {
    unsigned long startTime = millis();
    while (millis() - startTime < 3000) {
      digitalWrite(ledPin, HIGH);
      digitalWrite(ledPin2, LOW);
      delay(100);
      digitalWrite(ledPin, LOW);
      digitalWrite(ledPin2, HIGH);
      delay(100);
    }
  }

  digitalWrite(ledPin, LOW);
  digitalWrite(ledPin2, LOW);
}