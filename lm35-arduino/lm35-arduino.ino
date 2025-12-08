#define TEMP_SENSOR 2
#define LED_RED 12
#define LED_GREEN 13
float signalVoltage, celsiusTemp;
int cont = 0;
float media  = 0;

void setup() {
  Serial.begin(9600);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
}



void loop() {
  signalVoltage = analogRead(TEMP_SENSOR);
  celsiusTemp = (5 * signalVoltage * 100) / 1024; 
  media = media + celsiusTemp;
    cont += 1;
    if (cont >=5000){
      Serial.println(media/cont); 
      cont= 0; 
      media = 0;
      delay(1000);
    }
    
   
  if(celsiusTemp >= 30) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, HIGH);    
  } else {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_RED, LOW);
  }
 
  
}
  
