#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include "image_array.h"

#define NIM 132
#define IMG_WIDTH 640
#define IMG_HEIGHT 480
#define CHUNK_SIZE 8192

//Set Up Environment
const char *ssid = "gojo satoru is here";
const char *password = "soobinxgojo";
const char *mqtt_server = "192.168.181.116";
const int mqtt_port = 1883;
const char *publish_topic = "uts/iot/image";

uint8_t chunk[CHUNK_SIZE];

WiFiClient espClient;
PubSubClient client(espClient);
const int ledPin = 2;

void setupWifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setupTime() {
  configTime(0, 0, "pool.ntp.org");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    delay(500);
  }
}

long getTimestamp() {
  time_t now;
  time(&now);
  return (long)now;
}

void reconnect() {
  while (!client.connected()) {
    if (WiFi.status() != WL_CONNECTED) {
      setupWifi();
    }

    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32_board_client")) {
      Serial.println("MQTT Connected");
      client.publish("uts/iot/image", "ESP32 is online");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}

int getT() {
  return (NIM % 10) + 1;  // T = mod(xyz,10)+1
}

void sendFakeImageInChunks() {
  Serial.println("[INFO] Entering sendFakeImageInChunks()");
  //Get Time
  long timestamp = getTimestamp();
  int totalBytes = IMG_WIDTH * IMG_HEIGHT;
  int numChunks = (totalBytes + CHUNK_SIZE - 1) / CHUNK_SIZE;

  for (int chunkID = 0; chunkID < numChunks; chunkID++) {
    Serial.printf("  [INFO] Starting to send chunk %d/%d (Free Heap: %d)\n", chunkID + 1, numChunks, ESP.getFreeHeap());
    client.loop();

    int bytesToSend = min(CHUNK_SIZE, totalBytes - chunkID * CHUNK_SIZE);

    // Calculate the maximum possible payload size
    int maxPayloadSize = 100 + (bytesToSend * 2);  // Estimate: JSON overhead + 2 hex chars per byte
    char *payload = new char[maxPayloadSize + 1];  // Allocate dynamically

    if (payload == nullptr) {
      Serial.println("[ERROR] Failed to allocate payload buffer!");
      continue;  // Skip this chunk
    }

    int len = snprintf(payload, maxPayloadSize,
                       "{\"timestamp\":%ld,\"chunk_id\":%d,\"total_chunks\":%d,\"data\":\"",
                       timestamp, chunkID, numChunks);


    for (int j = 0; j < bytesToSend; j++) {
      int index = chunkID * CHUNK_SIZE + j;
      if (index < totalBytes) {
        len += sprintf(payload + len, "%02X", image_data[index]);
      } else {
        Serial.println("[WARNING] Payload buffer full!");
        break;
      }
    }

    strcat(payload, "\"}");

    if (client.publish(publish_topic, payload)) {
      Serial.printf("    [INFO] Sent chunk %d/%d (%d bytes)\n", chunkID + 1, numChunks, bytesToSend);
    } else {
      Serial.printf("    [ERROR] Failed to send chunk %d/%d\n", chunkID + 1, numChunks);
    }

    delete[] payload;  // Free the dynamically allocated memory
    delay(100);        // Increased delay
  }
  Serial.println("Exiting sendFakeImageInChunks()");
}

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  Serial.println("Booting...");
  setupWifi();
  setupTime();
  client.setServer(mqtt_server, mqtt_port);
  client.setBufferSize(20480);
  Serial.printf("Buffersize: %d\n", client.getBufferSize());
  Serial.printf("Free heap: %d\n", ESP.getFreeHeap());
  Serial.printf("Free PSRAM: %d\n", ESP.getFreePsram());
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();  // Maintain MQTT connection

  int K = 10;
  int T = getT();

  for (int i = 0; i < K; i++) {
    Serial.printf("[INF0] Sending image %d of %d\n", i + 1, K);
    sendFakeImageInChunks();
    delay(T * 1000);
  }

  Serial.println("[INFO] All images sent");
  while (1)
    ;
}