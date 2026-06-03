from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os
import serial
import threading
import json
import time

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

serial_data = {"status": "Desconectado", "last_packet": None, "total_packets": 0}
serial_connection = None
last_clean = time.time()

def read_serial():
    global serial_data, serial_connection, last_clean
    try:
        serial_connection = serial.Serial('COM4', 115200, timeout=1)
        serial_data["status"] = "Conectado"
        while True:
            line = serial_connection.readline().decode('utf-8').strip()
            if line:
                try:
                    data = json.loads(line)
                    serial_data["last_packet"] = data
                    serial_data["total_packets"] += 1

                    if time.time() - last_clean > 180:
                        supabase.table("wifi_packets").delete().neq("id", 0).execute()
                        supabase.table("lora_packets").delete().neq("id", 0).execute()
                        last_clean = time.time()
                        print("Base de datos limpiada")

                    if data["type"] == "wifi":
                        wifi_data = {
                            "ssid": data["ssid"],
                            "rssi": data["rssi"],
                            "mac": data["mac"],
                            "channel": data["channel"]
                        }
                        supabase.table("wifi_packets").insert(wifi_data).execute()
                    elif data["type"] == "lora":
                        lora_data = {
                            "rssi": data["rssi"],
                            "snr": data["snr"],
                            "frequency": data["freq"],
                            "payload": data.get("payload", "")
                        }
                        supabase.table("lora_packets").insert(lora_data).execute()
                except json.JSONDecodeError:
                    pass
    except Exception as e:
        serial_data["status"] = "Desconectado"
        print(f"Error Serial: {e}")

@app.get("/status")
def get_status():
    return serial_data

@app.get("/wifi")
def get_wifi():
    response = supabase.table("wifi_packets").select("*").order("timestamp", desc=True).limit(50).execute()
    return response.data

@app.get("/lora")
def get_lora():
    response = supabase.table("lora_packets").select("*").order("timestamp", desc=True).limit(50).execute()
    return response.data

@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=read_serial, daemon=True)
    thread.start()