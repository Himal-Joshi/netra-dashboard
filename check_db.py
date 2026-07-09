import sqlite3
import json
conn = sqlite3.connect('/home/ubuntu/netra-official/netra/data/netra.db')
print(conn.execute('PRAGMA table_info(automod_settings);').fetchall())
try:
    print(conn.execute('SELECT * FROM automod_settings LIMIT 1;').fetchall())
except Exception as e:
    print("Error:", e)
conn.close()
