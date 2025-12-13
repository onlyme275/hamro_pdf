import requests
import json

url = "http://127.0.0.1:8000/api/user/register"
payload = {
    "name": "Test API User",
    "email": "test_api_crash@example.com",
    "password": "StrongPassword123!@#"
}
headers = {
  'Content-Type': 'application/json'
}

print(f"Sending POST to {url}...")
try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
