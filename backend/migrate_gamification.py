import sqlite3

def run_migration():
    conn = sqlite3.connect('english_app.db')
    cursor = conn.cursor()
    
    # Add columns to users if they don't exist
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0")
        print("Added coins column")
    except sqlite3.OperationalError:
        print("coins column already exists")

    try:
        cursor.execute("ALTER TABLE users ADD COLUMN streak_shields INTEGER DEFAULT 0")
        print("Added streak_shields column")
    except sqlite3.OperationalError:
        print("streak_shields column already exists")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN active_theme VARCHAR DEFAULT 'default'")
        print("Added active_theme column")
    except sqlite3.OperationalError:
        print("active_theme column already exists")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN unlocked_themes VARCHAR DEFAULT 'default'")
        print("Added unlocked_themes column")
    except sqlite3.OperationalError:
        print("unlocked_themes column already exists")
        
    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    run_migration()
