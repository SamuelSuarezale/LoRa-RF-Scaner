# LoRa RF Scanner

Real-time WiFi and LoRa 915MHz RF scanner built with Heltec ESP32 V3, FastAPI, Supabase and React.

![Dashboard](https://img.shields.io/badge/Status-Active-00cc66) ![Python](https://img.shields.io/badge/Python-3.11-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688)

## Overview

This project uses a **Heltec WiFi LoRa 32 V3** module to scan nearby WiFi networks (2.4GHz) and LoRa signals (915MHz IoT devices) in real time. Data is stored in Supabase and visualized in a React dashboard.

## Features

- Real-time WiFi network scanning with RSSI, MAC, channel
- LoRa 915MHz packet detection (RSSI, SNR)
- Live RSSI bar chart with signal strength color coding
- Data stored in Supabase (PostgreSQL cloud)
- Auto-cleanup every 3 minutes to keep data fresh

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Hardware | Heltec WiFi LoRa 32 V3 (ESP32-S3 + SX1262) |
| Firmware | Arduino IDE + RadioLib + ArduinoJson |
| Backend | Python 3.11 + FastAPI + pyserial |
| Database | Supabase (PostgreSQL) |
| Frontend | React + Vite + Chart.js + Axios |

## Architecture

```
Heltec V3 → Serial (USB) → FastAPI → Supabase → React Dashboard
```

## Requirements

- Python 3.11
- Node.js 18+
- Arduino IDE
- Heltec WiFi LoRa 32 V3
- Supabase account (free tier)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/SamuelSuarezale/LoRa-RF-Scaner.git
cd LoRa-RF-Scaner
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pyserial supabase==1.2.0 python-dotenv
```

Create `.env` file in `backend/`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

Run the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Database (Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE wifi_packets (
  id SERIAL PRIMARY KEY,
  ssid TEXT,
  rssi INTEGER,
  mac TEXT,
  channel INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lora_packets (
  id SERIAL PRIMARY KEY,
  rssi INTEGER,
  snr FLOAT,
  frequency FLOAT,
  payload TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Arduino

Open `arduino/rf_scanner.ino` in Arduino IDE and upload to **Heltec WiFi LoRa 32 V3**.

Required libraries:
- RadioLib
- ArduinoJson
- U8g2

## Usage

1. Connect Heltec V3 via USB
2. Start backend: `uvicorn main:app --reload`
3. Start frontend: `npm run dev`
4. Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Heltec connection status |
| GET | `/wifi` | Last 50 WiFi packets |
| GET | `/lora` | Last 50 LoRa packets |
| GET | `/docs` | Swagger UI documentation |

## Author

**Samuel Suárez** — Ingeniería en Telecomunicaciones  
Universidad de Pamplona, Norte de Santander, Colombia  
GitHub: [@SamuelSuarezale](https://github.com/SamuelSuarezale)