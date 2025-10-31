#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEBeacon.h>
#include <BLEAdvertising.h>
#include <BLEServer.h>

// CHANGE THIS to your actual GitHub Pages URL:
const char* URL_TO_BROADCAST = "https://thealiramezani.github.io/sta-device-discovery/?d=CASMED-FORESIGHT-ELITE";

BLEAdvertising* pAdvertising;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting Eddystone URL beacon...");

  BLEDevice::init("STA Device Tag");
  pAdvertising = BLEDevice::getAdvertising();

  BLEAdvertisementData advData;
  // Build Eddystone-URL frame
  std::string urlServiceData = "";
  urlServiceData += (char)0x10; // Eddystone-URL frame type
  urlServiceData += (char)0xEE; // calibrated Tx power (dummy)

  // Eddystone URL scheme prefix: 0x03 = "https://"
  urlServiceData += (char)0x03;

  // Encode the rest of the URL
  const char* url = URL_TO_BROADCAST;
  for (size_t i = 8; i < strlen(url); i++) { // skip "https://"
    urlServiceData += url[i];
  }

  advData.setFlags(0x04); // BR_EDR_NOT_SUPPORTED
  advData.addData(std::string("\x16\xAA\xFE", 3) + urlServiceData); // 0xFEAA = Eddystone UUID

  pAdvertising->setAdvertisementData(advData);
  pAdvertising->start();

  Serial.println("Beacon started.");
}

void loop() {
  // nothing
}
