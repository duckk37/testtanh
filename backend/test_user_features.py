import requests
import uuid
import sys
import time

BASE_URL = "http://localhost:8000"

def print_result(name, success, details="", res=None):
    status = "✅ PASSED" if success else "❌ FAILED"
    print(f"{status} - {name} {details}")
    if not success:
        if res is not None:
            print(f"Response: {res.text}")
        sys.exit(1)

def run_tests():
    print("🚀 Bắt đầu test các chức năng của User...")
    time.sleep(1) # wait for server if just started
    
    # 1. Register
    test_id = str(uuid.uuid4())[:8]
    username = f"testuser_{test_id}"
    email = f"test_{test_id}@example.com"
    password = "password123"
    
    res = requests.post(f"{BASE_URL}/register", json={
        "username": username,
        "email": email,
        "password": password
    })
    print_result("Register User", res.status_code == 200)
    
    # 2. Login
    res = requests.post(f"{BASE_URL}/login", data={
        "username": email,
        "password": password
    })
    print_result("Login User", res.status_code == 200)
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Get Profile
    res = requests.get(f"{BASE_URL}/users/me", headers=headers)
    print_result("Get Profile", res.status_code == 200, f"(Username: {res.json().get('username')})")
    
    # 4. Gamification / Quests
    res = requests.get(f"{BASE_URL}/users/me/quests", headers=headers)
    print_result("Get Daily Quests", res.status_code == 200, f"({len(res.json())} quests found)")
    
    # 5. Store / Buy Item (Expect 400 Not enough coins, but not 500)
    res = requests.post(f"{BASE_URL}/store/buy/shield_1", headers=headers)
    print_result("Store Buy Item (No Coins)", res.status_code == 400)
    
    # 6. Learning Path Generation (AI Test)
    res = requests.post(f"{BASE_URL}/learning-path/generate", headers=headers, json={
        "answers": {"q1": "A", "q2": "B"}
    })
    print_result("AI Learning Path Generate", res.status_code == 200, res=res)
    
    # 7. Check current learning path
    res = requests.get(f"{BASE_URL}/learning-path/current", headers=headers)
    print_result("Get Current Learning Path", res.status_code == 200)
    
    # 8. Check Writing AI
    res = requests.post(f"{BASE_URL}/api/check-writing", headers=headers, json={
        "text": "Hello world this is a test."
    })
    print_result("AI Check Writing", res.status_code == 200)
    
    # 9. Get Courses
    res = requests.get(f"{BASE_URL}/courses")
    print_result("Get Courses List", res.status_code == 200)
    
    # 10. Certificates (Expect 404 or 400 but not 500)
    res = requests.get(f"{BASE_URL}/certificates/generate?course_id=dummy_id", headers=headers)
    print_result("Certificate Generation (Invalid Course)", res.status_code in [404, 400])
    
    print("\n🎉 Tất cả các API cốt lõi của User đều hoạt động ổn định!")

if __name__ == "__main__":
    try:
        run_tests()
    except requests.exceptions.ConnectionError:
        print("❌ FAILED - Server is not running on http://localhost:8000")
