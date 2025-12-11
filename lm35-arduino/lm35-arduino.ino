#define TEMP_SENSOR 2
#define LED_RED 12
#define LED_BLUE 13

float signalVoltage, celsiusTemp;
int cont = 0;
float media  = 0;

void setup() {
  Serial.begin(9600);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
  DIDR0 |= (1 << ADC0D); //deshabilita entradasdigitales en a0
  delay(100);
}



void loop() {
  signalVoltage = analogRead(TEMP_SENSOR);
  celsiusTemp = (5 * signalVoltage * 100) / 1024; 
  media = media + celsiusTemp;
  cont += 1;
    
  if (cont >=5000){
    Serial.println(media/cont,1); 
    cont= 0; 
    media = 0;
    delay(1000);
  }
    
   
  if(celsiusTemp >= 30) {
    digitalWrite(LED_BLUE, LOW);
    digitalWrite(LED_RED, HIGH);    
  } else {
    digitalWrite(LED_BLUE, HIGH);
    digitalWrite(LED_RED, LOW);
  }
 
  
}
  
