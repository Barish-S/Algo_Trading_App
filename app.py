from flask import Flask, jsonify
from flask_cors import CORS
from mysql.connector import pooling, Error

app = Flask(__name__)
CORS(app)  # Enable CORS if React app is on a different domain

# MySQL connection pool initialization
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,  # Adjust the pool size as needed
    host='193.203.184.38',
    database='u557876283_trade_data',
    user='u557876283_pcs_fintech',
    password='t1#:V8=k'
)

# Endpoint to fetch updated data
@app.route('/forward', methods=['GET'])
def get_updated_data():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM modification_data")
        data = cursor.fetchall()
        return jsonify(data)
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/reverse', methods=['GET'])
def get_reverse_data():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM reverse_data")
        data = cursor.fetchall()
        return jsonify(data)
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/clear-table', methods=['POST'])
def clear_table():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM modification_data")
        connection.commit()
        return jsonify("success")
    except Error as e:
        return jsonify({"error": f"Error clearing data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True)
