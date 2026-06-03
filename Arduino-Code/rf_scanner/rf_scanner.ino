#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>
#include <RadioLib.h>
#include <WiFi.h>
#include <ArduinoJson.h>

// ===== OLED =====
#define OLED_SDA 17
#define OLED_SCL 18
#define OLED_RST 21
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, OLED_SCL, OLED_SDA, OLED_RST);

// ===== LORA PINES =====
#define LORA_SCK   9
#define LORA_MISO  11
#define LORA_MOSI  10
#define LORA_CS    8
#define LORA_RST   12
#define LORA_DIO1  14
#define LORA_BUSY  13

SX1262 radio = new Module(LORA_CS, LORA_DIO1, LORA_RST, LORA_BUSY);

void mostrarOLED(const char* l1, const char* l2 = "", const char* l3 = "") {
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);
    u8g2.drawStr(0, 12, "LoRa RF Scanner");
    u8g2.drawStr(0, 28, l1);
    u8g2.drawStr(0, 44, l2);
    u8g2.drawStr(0, 60, l3);
    u8g2.sendBuffer();
}

void scanWifi() {
    int n = WiFi.scanNetworks();
    for (int i = 0; i < n; i++) {
        StaticJsonDocument<200> doc;
        doc["type"] = "wifi";
        doc["ssid"] = WiFi.SSID(i);
        doc["rssi"] = WiFi.RSSI(i);
        doc["mac"] = WiFi.BSSIDstr(i);
        doc["channel"] = WiFi.channel(i);
        serializeJson(doc, Serial);
        Serial.println();
    }
    mostrarOLED("WiFi scan", ("Redes: " + String(n)).c_str());
}

void scanLora() {
    SX1262 radio = new Module(LORA_CS, LORA_DIO1, LORA_RST, LORA_BUSY);
    int state = radio.receive((uint8_t*)nullptr, 0);
    if (state == RADIOLIB_ERR_NONE) {
        StaticJsonDocument<200> doc;
        doc["type"] = "lora";
        doc["rssi"] = radio.getRSSI();
        doc["snr"] = radio.getSNR();
        doc["freq"] = 915.0;
        serializeJson(doc, Serial);
        Serial.println();
        mostrarOLED("LoRa packet!", ("RSSI: " + String(radio.getRSSI())).c_str());
    }
}

void setup() {
    Serial.begin(115200);
    u8g2.begin();
    mostrarOLED("Iniciando...");
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_CS);
    radio.begin();
    radio.setFrequency(915.0);
    radio.setBandwidth(125.0);
    radio.setSpreadingFactor(7);
    mostrarOLED("Listo!", "Escaneando...");
}

void loop() {
    scanWifi();
    scanLora();
    delay(5000);
}