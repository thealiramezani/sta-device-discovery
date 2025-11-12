#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEAdvertising.h>

// Keep this URL very short (<= ~22 chars after "https://")
const char* URL_TO_BROADCAST = "https://is.gd/UXNWgS";

BLEAdvertising* pAdvertising;
BLEServer* pServer;

// Immediately drop any incoming connection and keep advertising.
class Rejector : public BLEServerCallbacks {
  void onConnect(BLEServer* s) override {
    // Brief tick for stack stability, then disconnect central
    delay(10);
    s->disconnect(0);  // drop the only connection handle
  }
  void onDisconnect(BLEServer* s) override {
    // Resume advertising the moment a central goes away
    if (pAdvertising) pAdvertising->start();
  }
};

void startAdvertising() {
  BLEAdvertisementData advData;
  BLEAdvertisementData scanResp;   // we’ll use this for the name
  BLEUUID eddystoneUUID((uint16_t)0xFEAA);

  advData.setFlags(ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT);

  // --- Eddystone-URL frame ---
  String frame;
  frame += (char)0x10;   // URL frame type
  frame += (char)0xEE;   // Tx power placeholder
  frame += (char)0x03;   // "https://"

  const char* prefix = "https://";
  for (size_t i = strlen(prefix); i < strlen(URL_TO_BROADCAST); i++) {
    frame += URL_TO_BROADCAST[i];
  }

  advData.setServiceData(eddystoneUUID, frame);

  // Add the friendly name ONLY to the scan-response packet
  scanResp.setName("STA Device Tag");

  pAdvertising->setAdvertisementData(advData);
  pAdvertising->setScanResponseData(scanResp);

  pAdvertising->start();
}


void setup() {
  Serial.begin(115200);
  BLEDevice::init("");                 // no GAP name
  BLEDevice::setPower(ESP_PWR_LVL_P3); // optional: modest TX power to reduce range

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new Rejector());

  pAdvertising = BLEDevice::getAdvertising();
  startAdvertising();

  Serial.println("Eddystone-URL beacon (auto-reject) started");
}

void loop() {
  // Safety: if advertising ever stops, restart it.
  static uint32_t lastCheck = 0;
  if (millis() - lastCheck > 3000) {
    lastCheck = millis();
    // getAdvertising()->isAdvertising() exists on some versions; if not, just restart periodically:
    pAdvertising->start(); // harmless if already advertising
  }
}
