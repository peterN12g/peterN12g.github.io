const int SW_PIN = 7;
const int xMov = A0;
const int yMov = A1;
bool holdDown = false;
const int buzz_PIN = 8;
const int led1_PIN = 9;
const int led2_PIN = 10;


void setup() {
  Serial.begin(9600);

  pinMode(SW_PIN, INPUT_PULLUP);
  pinMode(led1_PIN, OUTPUT);
  pinMode(led2_PIN, OUTPUT);
  digitalWrite(led1_PIN, LOW);
  digitalWrite(led2_PIN, LOW);
}

void loop() {
  double xInf = analogRead(xMov)-512;
  double yInf = analogRead(yMov)-512;
  if (abs(xInf) < 50) xInf = 0;
  if (abs(yInf) < 50) yInf = 0;
  double magn = sqrt(xInf*xInf + yInf*yInf);
  if (magn > 0) {
    xInf /= magn;
    yInf /= magn;
  }

  Serial.print("joystart");
  Serial.print(xInf);
  Serial.print(",");
  Serial.println(yInf);

  if (digitalRead(SW_PIN) == LOW) {
    if (!holdDown) {
      Serial.println("press");
      holdDown = true; 
    }
  } else {
    holdDown = false;
  }
  
    if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "buzz") {
      tone(buzz_PIN, 1000, 200);
    }
    else if (command == "ding") {
      digitalWrite(led1_PIN, HIGH);
      delay(300);
      digitalWrite(led1_PIN, LOW);
    }
    else if (command == "dong") {
      digitalWrite(led2_PIN, HIGH);
      delay(300);
      digitalWrite(led2_PIN, LOW);
    }
  }

  delay(20);
}