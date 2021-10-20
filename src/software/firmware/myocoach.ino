void setup() {
  Serial.begin(9600); // Starts the serial communication
}
void loop() 
{
  
  int sensorValue1 = analogRead(A0);
  int sensorValue2 = analogRead(A1);
  
  // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  float e1 = map(sensorValue1,0,1023,0,255);
  float e2 = map(sensorValue2,0,1023,0,255);
  byte data = Serial.read();
  if(data == 's')
  {
    Serial.print(e1);
    Serial.print(":");
    Serial.print(e2); 
    Serial.println();
  }
  delay(10);
}
