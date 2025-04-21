const int ledPin = 13;
const int potPin = A0;
bool ledState = false;
String input = "";

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  Serial.begin(9600);
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      input.trim();
      if (input == "TOGGLE_LED") {
        ledState = !ledState;
        digitalWrite(ledPin, ledState ? HIGH : LOW);
        Serial.println(ledState ? "LED ON" : "LED OFF");
      }
      input = "";
    } else {
      input += c;
    }
  }
  int potValue = analogRead(potPin);
  Serial.println(potValue);

  delay(50);
}
