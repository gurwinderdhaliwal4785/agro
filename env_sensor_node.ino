#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "gurwinder";
const char* password = "12345678";
const char* mqtt_server = "";

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Soil moisture sensor pin
int soilPin = A0;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);

  dht.begin();
  pinMode(soilPin, INPUT);
}

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("Env_Sensor_Node")) {
      Serial.println("Connected to MQTT broker");
    } else {
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    float temp = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilMoisture = analogRead(soilPin);

    snprintf(msg, 50, "Temperature: %.1f, Humidity: %.1f", temp, humidity);
    client.publish("farm/env", msg);
    Serial.println(msg);

    snprintf(msg, 50, "%d", soilMoisture);
    client.publish("farm/soil", msg);
    Serial.print("Soil Moisture: ");
    Serial.println(msg);
  }
}
