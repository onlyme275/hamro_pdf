import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.serializers import UserCreateSerializer

# Simulate frontend payload (MISSING password_confirm)
data = {
    'email': 'test_crash@example.com',
    'password': 'StrongPassword123!@#',
    'name': 'Test User Crash'
}

print("Attempting to register user with missing password_confirm...")
try:
    serializer = UserCreateSerializer(data=data)
    if serializer.is_valid():
        print("Serializer is valid (Unexpected).")
    else:
        print(f"Validation Error (Expected): {serializer.errors}")
except KeyError as e:
    print(f"KeyError Caught! This is likely the 500 cause: {e}")
    traceback.print_exc()
except Exception as e:
    print(f"Exception occurred: {e}")
    traceback.print_exc()
