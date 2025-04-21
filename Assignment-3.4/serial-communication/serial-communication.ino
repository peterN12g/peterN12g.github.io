const int SW_PIN = 7;
const int xMov = A0;
const int yMov = A1;
bool holdDown = false;

void setup() {
  Serial.begin(9600);

  pinMode(SW_PIN, INPUT_PULLUP);
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
  
  delay(20);
}