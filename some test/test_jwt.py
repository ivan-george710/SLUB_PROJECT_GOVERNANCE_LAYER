from app.auth.jwt_handler import create_access_token, verify_access_token


user_data = {
    "sub": "ivan",
    "role": "admin",
}

token = create_access_token(user_data)

print("Generated token:")
print(token)

decoded_payload = verify_access_token(token)

print("Decoded payload:")
print(decoded_payload)
