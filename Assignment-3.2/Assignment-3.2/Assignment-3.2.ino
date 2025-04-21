//Video- https://www.youtube.com/shorts/UtxnhyHvjqw
//Objective-  land between 201-235 brightness to light up led-0 after 5s
//Rules- begin turning after countdown begins, final brightness will be printed out, if player lands on green(led-0) they win, otherwise lose, players take turns
//Challenge- estimate landing within the goal brightness before the countdown ends
//Interaction- Potentiometer dial used to modify brightness from 0-255 

int potPin = A0; 
int ledPins[] = {12, 13};
int numLEDs = 2;
int brightness;

void setup() {
  // put your setup code here, to run once:
  for (int i = 0; i < numLEDs; i++) {
    pinMode(ledPins[i], OUTPUT);
  }

  Serial.begin(9600);
  
  for (int i = 5; i > 0; i--) {
    Serial.print("Time: ");
    Serial.println(i);

    int potValue = analogRead(potPin);
    brightness = map(potValue, 0, 1023, 0, 255);

    delay(1000);
  }

  Serial.print("Final potentiometer value: ");
  Serial.println(brightness);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (brightness >= 0 && brightness < 201) {
    lightUpLED(1);
  } 
  else if (brightness >= 201 && brightness <= 235) {
    lightUpLED(0);
  }
  else if (brightness > 235 && brightness <= 255) {
    lightUpLED(1);
  }

  delay(50);
}

void lightUpLED(int ledIndex) {
  for (int i = 0; i < numLEDs; i++) {
    digitalWrite(ledPins[i], i == ledIndex ? HIGH : LOW);
  }
}
