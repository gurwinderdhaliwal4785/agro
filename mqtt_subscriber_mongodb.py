import paho.mqtt.client as mqtt
import pymongo
from datetime import datetime

# MongoDB connection setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["agro_sense"]
collection = db["sensor_data"]

# MQTT settings
broker = "your_mqtt_broker_ip"
port = 1883

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("farm/#")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.topic} -> {msg.payload.decode()}")
    data = {
        "topic": msg.topic,
        "value": msg.payload.decode(),
        "timestamp": datetime.utcnow()
    }
    collection.insert_one(data)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(broker, port, 60)
client.loop_forever()
