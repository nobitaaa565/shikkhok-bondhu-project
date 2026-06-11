import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def get_token(username, password):
    url = f"{BASE_URL}/auth/login/"
    data = {"username": username, "password": password}
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()["access"]
    else:
        print(f"Failed to login {username}: {response.text}")
        return None

def create_strategy(token, data):
    url = f"{BASE_URL}/strategies/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, headers=headers, json=data)
    return response

def list_strategies(token):
    url = f"{BASE_URL}/strategies/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    return response

def main():
    # 1. Login as Admin
    admin_token = get_token("testuser", "testpassword123")
    if not admin_token: return

    # 2. Login as Normal User
    user2_token = get_token("testuser2", "testpassword123")
    if not user2_token: return

    print("Tokens obtained.")

    # 3. Admin Creates Strategy
    strategy_data = {
        "title": "Gamified Mathematics",
        "content": "Increase engagement by using digital badges and leveling systems for math problems.",
        "author": "Admin User",
        "grade": "g4",
        "subject": "math",
        "bookCover": "bg-indigo-900",
        "readTime": "8 min read"
    }
    
    print("\nAdmin Creating Strategy...")
    resp = create_strategy(admin_token, strategy_data)
    if resp.status_code == 201:
        strategy_id = resp.json()['id']
        print(f"Strategy Created Successfully! ID: {strategy_id}")
    else:
        print("Strategy Creation Failed:", resp.text)
        return

    # 4. User 2 Lists Strategies (Should see it)
    print("\nUser 2 Listing Strategies:")
    resp = list_strategies(user2_token)
    print(json.dumps(resp.json(), indent=2))

    # 5. User 2 Tries to Create Strategy (Should Fail)
    print("\nUser 2 Trying to Create Strategy (Should Fail):")
    resp = create_strategy(user2_token, strategy_data)
    print(f"Status: {resp.status_code}, Response: {resp.text}")

if __name__ == "__main__":
    main()
