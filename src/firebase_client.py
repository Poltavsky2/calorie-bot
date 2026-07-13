import httpx
import json
import logging
import socket
import time
import uuid

# --- FIX FOR HUGGING FACE IPV6 TIMEOUTS ---
old_getaddrinfo = socket.getaddrinfo
def new_getaddrinfo(*args, **kwargs):
    responses = old_getaddrinfo(*args, **kwargs)
    return [response for response in responses if response[0] == socket.AF_INET]
socket.getaddrinfo = new_getaddrinfo
# ------------------------------------------

logger = logging.getLogger(__name__)

PROJECT_ID = "gen-lang-client-0531427038"
DB_ID = "ai-studio-bioprizma-4507c715-35b3-4388-9a86-c14535f1207b"
API_KEY = "AIzaSyCPfRCkJzO5Q3EZSxL0f2Q67yMEFqasfhQ"

def encode_telegram_id(user_id: int) -> str:
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    num = user_id
    tg_code = ''
    while num > 0:
        tg_code = chars[num % 32] + tg_code
        num = num // 32
    return tg_code.rjust(10, 'A')

async def save_diet_entry_firebase(user_id: int, entry_data: dict):
    user_key = encode_telegram_id(user_id)
    doc_id = str(uuid.uuid4())
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/{DB_ID}/documents/users/{user_key}/diet/{doc_id}?key={API_KEY}"
    
    # Map dictionary to Firestore field types
    fields = {}
    for k, v in entry_data.items():
        if isinstance(v, int):
            fields[k] = {"integerValue": v}
        elif isinstance(v, float):
            fields[k] = {"doubleValue": v}
        elif isinstance(v, str):
            fields[k] = {"stringValue": v}
        elif isinstance(v, list):
            # For simplicity, if it's items, we convert to string or handle properly. 
            # In calorie_bot.py, ingredients_json is a string, but the frontend expects items array.
            # We'll just pass items as string if we don't need array structure for now, 
            # but WebApp types.ts expects `items` as Array of objects.
            # calorie_bot currently passes `ingredients_json` as a string.
            # We'll just use stringValue for ingredients_json.
            pass

    # Ensure id is in fields
    fields["id"] = {"stringValue": doc_id}
    
    # Map meal_type to mealType to match frontend
    if "meal_type" in entry_data:
        meal_map = {"Завтрак": "breakfast", "Обед": "lunch", "Ужин": "dinner", "Перекус": "snack", "Вода": "water", "Шаги": "steps"}
        mt = meal_map.get(entry_data.get("meal_type"), "snack")
        if entry_data.get("meal_type") == "steps":
            mt = "steps"
        fields["mealType"] = {"stringValue": mt}
        
    payload = {"fields": fields}
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.patch(url, json=payload, timeout=10.0)
            if res.status_code >= 400:
                logger.error(f"Error saving to Firebase: {res.text}")
    except Exception as e:
        logger.error(f"Exception saving to Firebase: {e}")

async def get_diet_entries_firebase(user_id: int, limit: int = 10) -> list:
    user_key = encode_telegram_id(user_id)
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/{DB_ID}/documents:runQuery?key={API_KEY}"
    
    payload = {
        "structuredQuery": {
            "from": [{"collectionId": "diet"}],
            "orderBy": [{"field": {"fieldPath": "timestamp"}, "direction": "DESCENDING"}],
            "limit": limit
        }
    }
    
    # To query a subcollection in REST API we can use runQuery on the document path
    query_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/{DB_ID}/documents/users/{user_key}:runQuery?key={API_KEY}"
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(query_url, json=payload, timeout=10.0)
            if res.status_code == 200:
                results = res.json()
                entries = []
                for r in results:
                    if "document" in r:
                        fields = r["document"]["fields"]
                        entry = {}
                        for k, v in fields.items():
                            val = list(v.values())[0]
                            if "integerValue" in v:
                                val = int(v["integerValue"])
                            elif "doubleValue" in v:
                                val = float(v["doubleValue"])
                            entry[k] = val
                        entries.append(entry)
                return entries
            else:
                logger.error(f"Error reading from Firebase: {res.text}")
                return []
    except Exception as e:
        logger.error(f"Exception reading from Firebase: {e}")
        return []

async def get_user_settings_firebase(user_id: int) -> dict:
    user_key = encode_telegram_id(user_id)
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/{DB_ID}/documents/users/{user_key}/diet/bot_settings?key={API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, timeout=10.0)
            if res.status_code == 200:
                data = res.json()
                fields = data.get("fields", {})
                settings_str = fields.get("settings_json", {}).get("stringValue", "{}")
                return json.loads(settings_str)
            return {}
    except:
        return {}

async def save_user_settings_firebase(user_id: int, settings: dict):
    user_key = encode_telegram_id(user_id)
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/{DB_ID}/documents/users/{user_key}/diet/bot_settings?key={API_KEY}"
    # Merge with existing fields if document exists
    payload = {
        "fields": {
            "settings_json": {"stringValue": json.dumps(settings)}
        }
    }
    # To not overwrite the entire document (which might contain 'name', 'appData', 'diet' etc.), 
    # we use updateMask
    update_url = f"{url}&updateMask.fieldPaths=settings_json"
    
    try:
        async with httpx.AsyncClient() as client:
            await client.patch(update_url, json=payload, timeout=10.0)
    except Exception as e:
        logger.error(f"Exception saving settings to Firebase: {e}")
