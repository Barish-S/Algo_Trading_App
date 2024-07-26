from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS if React app is on a different domain

# MySQL connection initialization (similar to your existing code)
def get_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host='193.203.184.38',
            database='u557876283_trade_data',
            user='u557876283_pcs_fintech',
            password='t1#:V8=k'
        )
        return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

# Endpoint to fetch updated data
@app.route('/forward', methods=['GET'])
def get_updated_data():
    try:
        connection = get_mysql_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM modification_data")
            data = cursor.fetchall()  
            return jsonify(data)
        else:
            return jsonify({"error": "Failed to connect to MySQL"}), 500
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/reverse', methods=['GET'])
def get_reverse_data():
    try:
        connection = get_mysql_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM reverse_data")
            data = cursor.fetchall()  
            return jsonify(data)
        else:
            return jsonify({"error": "Failed to connect to MySQL"}), 500
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
