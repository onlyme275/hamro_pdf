import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS hamropdf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("Database 'hamropdf' created successfully.")
except Exception as e:
    print(f"Error creating database: {e}")
finally:
    if 'connection' in locals():
        connection.close()
