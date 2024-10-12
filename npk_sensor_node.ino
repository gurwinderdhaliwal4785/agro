#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "gurwinder";
const char* password = "12345678";
const char* mqtt_server = "your_mqtt_broker_ip";

// NPK sensor pins and initialization
int npkPin = A0;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);

  // Initialize NPK sensor
  pinMode(npkPin, INPUT);
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
    if (client.connect("NPK_Sensor_Node")) {
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

    int npkValue = analogRead(npkPin);
    snprintf(msg, 50, "%d", npkValue);
    client.publish("farm/npk", msg);
    Serial.print("NPK Value: ");
    Serial.println(msg);
  }
}
