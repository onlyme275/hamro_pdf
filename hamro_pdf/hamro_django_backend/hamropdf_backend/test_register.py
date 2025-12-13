import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.serializers import UserCreateSerializer, UserSerializer
from apps.users.views import get_tokens_for_user
import traceback

data = {
    'email': 'test_strong@example.com',
    'password': 'StrongPassword123!@#',
    'password_confirm': 'StrongPassword123!@#',
    'name': 'Test User Strong'
}

print("Attempting to register user with strong password...")
try:
    serializer = UserCreateSerializer(data=data)
    if serializer.is_valid():
        print("Serializer is valid. Saving...")
        user = serializer.save()
        print(f"User saved: {user.email}")
        
        print("Generating tokens...")
        tokens = get_tokens_for_user(user)
        print("Tokens generated successfully.")
        
        print("Final Data:", {
            'user': UserSerializer(user).data,
            'token': tokens['access']
        })
    else:
        print(f"Validation Error: {serializer.errors}")
except Exception as e:
    print("Exception occurred:")
    traceback.print_exc()
