import sqlite3

try:
    conn = sqlite3.connect('english_app.db')
    cursor = conn.execute("UPDATE users SET role='admin' WHERE email='phtienduc37@gmail.com'")
    print(f"Updated {cursor.rowcount} rows.")
    conn.commit()
    conn.close()
except Exception as e:
    print("Error:", e)
