import json
import binascii
import numpy as np
from PIL import Image
import os
from collections import defaultdict
from datetime import datetime
from paho.mqtt.client import Client
from supabase import create_client, Client as SupabaseClient
from config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUCKET, MQTT_BROKER, MQTT_PORT, MQTT_TOPIC, IMG_HEIGHT, IMG_WIDTH

supabase: SupabaseClient = create_client(SUPABASE_URL, SUPABASE_KEY)
image_chunks = defaultdict(dict)

def decode_image(chunks_dict, total_chunks, timestamp):
    full_image = ''.join(chunks_dict[i] for i in range(total_chunks))
    raw_bytes = binascii.unhexlify(full_image)
    image_array = np.frombuffer(raw_bytes, dtype=np.uint8).reshape((IMG_HEIGHT, IMG_WIDTH))
    
    img = Image.fromarray(image_array, 'L') 
    img.save(f"{timestamp}.png")    
    print(f"[INFO] Image saved as {timestamp}.png")
    
    return img
    
# === Callback when message is received ===
def on_message(client, userdata, msg):
    print(f"[MQTT] Message received on topic {msg.topic}")    
    try:
        payload = json.loads(msg.payload.decode())
        timestamp = payload['timestamp']
        chunk_id = payload['chunk_id']
        total_chunks = payload['total_chunks']
        data = payload['data']
        
        image_chunks[timestamp][chunk_id] = data
        print(f"📦 Received chunk {chunk_id + 1}/{total_chunks} for image {timestamp}")
        
            
        if len(image_chunks[timestamp]) == total_chunks:
            receive_time = datetime.now().isoformat()
            missing = [i for i in range(total_chunks) if i not in image_chunks[timestamp]]
            if missing:
                print(f"[WARN] Missing chunks: {missing}")
            else:
                print(f"[INFO] All chunks received for image {timestamp}. Decoding...")
                decode_image(image_chunks[timestamp], total_chunks, timestamp)
        
                filename = f"{timestamp}.png"
                with open(filename, "rb") as f:
                    supabase.storage.from_(SUPABASE_BUCKET).upload(
                        file = f,
                        path = filename,
                        file_options={"content_type": "image/png"}
                    )
                    print("[SUPABASE] Image uploaded to Supabase Storage.") 
                
                supabase.table("image_metadata").insert({
                    "timestamp": timestamp,
                    "total_chunks": total_chunks,
                    "file_path": filename,
                    "receive_time": receive_time,
                    "created_at": datetime.now().isoformat()
                }).execute()
                print("[SUPABASE] Metadata saved.")

                del image_chunks[timestamp]
                os.remove(filename)
                
    except Exception as e:
        print("[ERROR]", e)

# === Main Subscriber Setup ===
client = Client()
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.subscribe(MQTT_TOPIC)
client.on_message = on_message

print("[MQTT] Subscribed. Waiting for messages...")
client.loop_forever()