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

def upload_file(token, filename, is_public=False, category="other"):
    url = f"{BASE_URL}/files/upload/"
    headers = {"Authorization": f"Bearer {token}"}
    files = {'file': (filename, open(filename, 'rb'))}
    data = {'is_public': is_public, 'category': category}
    response = requests.post(url, headers=headers, files=files, data=data)
    return response

def list_files(token, category=None):
    url = f"{BASE_URL}/files/"
    headers = {"Authorization": f"Bearer {token}"}
    params = {}
    if category:
        params['category'] = category
    response = requests.get(url, headers=headers, params=params)
    return response

def main():
    # 1. Login as Admin (User 1)
    admin_token = get_token("testuser", "testpassword123")
    if not admin_token: return

    # 2. Login as User 2
    user2_token = get_token("testuser2", "testpassword123")
    if not user2_token: return

    print("Tokens obtained.")

    # 3. Admin Uploads Public Training File
    with open("training_doc.txt", "w") as f:
        f.write("Training Content")
    
    print("Uploading public file as Admin...")
    resp = upload_file(admin_token, "training_doc.txt", is_public=True, category="training")
    if resp.status_code == 201:
        print("Upload Successful:", resp.json())
    else:
        print("Upload Failed:", resp.text)

    # 4. User 2 Lists Files (Should see it)
    print("\nUser 2 Listing Files:")
    resp = list_files(user2_token)
    print(json.dumps(resp.json(), indent=2))

    # 5. User 2 Filters by Category 'training'
    print("\nUser 2 Listing 'training' Files:")
    resp = list_files(user2_token, category="training")
    print(json.dumps(resp.json(), indent=2))

    # 6. User 2 Filters by Category 'exclusive' (Should be empty)
    print("\nUser 2 Listing 'exclusive' Files:")
    resp = list_files(user2_token, category="exclusive")
    print(json.dumps(resp.json(), indent=2))

if __name__ == "__main__":
    main()
