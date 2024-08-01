from flask import Flask, request, jsonify
from datetime import datetime,timedelta
import asyncio
import pandas as pd
import os
import mysql.connector
from mysql.connector import Error, OperationalError
from pix_apidata import apidata_lib
from dhanhq import dhanhq
from flask_cors import CORS
from mysql.connector import pooling

app = Flask(__name__)
CORS(app)
# Define your global variables and constants here
client_id = '1100951353'
access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzI0MDg5ODIyLCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDk1MTM1MyJ9.IyNAKzoeWKH9-onO6GALwya3Tz9RrzBBrZUZbm_CiBBcyLcu2K74QlEmhAp7fU2agwp3W8U8AYvT_P-H8HqmHw'
url = 'wss://api-feed.dhan.co'
dhan = dhanhq(client_id, access_token)

# MySQL connection details
host_name = '193.203.184.38'
db = 'u557876283_trade_data'
user_name = 'u557876283_pcs_fintech'
db_password = 't1#:V8=k'

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,  # Adjust the pool size as needed
    host='193.203.184.38',
    database='u557876283_trade_data',
    user='u557876283_pcs_fintech',
    password='t1#:V8=k'
)

def initialize_connection():
    global connection, cursor
    try:
        connection = mysql.connector.connect(
            host=host_name,
            database=db,
            user=user_name,
            password=db_password
        )
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            db_info = connection.get_server_info()
            print(f"Connected to MySQL Server version {db_info}")
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")

def close_connection():
    global connection, cursor
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection is closed")

def reconnect():
    close_connection()
    initialize_connection()

def connect_to_mysql(company_name, open_price=None, entry_price=None, entry_time=None, closing_price=None, closing_time=None, entry_volume=None, yesterday_volume=None, average=None,avg_percent=None, profit_one_percentage=None, acheived_time=None, stop_loss=None, stop_loss_time=None):
    global cursor, connection
    try:
        cursor.execute("SELECT * FROM forward WHERE company_name = %s", (company_name,))
        row = cursor.fetchone()

        if not row:
            insert_query = """
                INSERT INTO forward 
                (company_name, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, average,avg_percent)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
            """
            insert_values = (company_name, float(open_price), float(entry_price), entry_time, float(closing_price), closing_time, int(entry_volume), int(yesterday_volume), float(average),float(avg_percent))
            cursor.execute(insert_query, insert_values)
            print(f"Inserted new record for {company_name}.")
            connection.commit()

        else:
            update_query = "UPDATE forward SET closing_price=%s, closing_time=%s WHERE company_name=%s"
            update_data = (float(closing_price), closing_time, company_name)
            cursor.execute(update_query, update_data)
            connection.commit()

            if profit_one_percentage and acheived_time:
                cursor.execute("SELECT * FROM forward WHERE company_name = %s", (company_name,))
                row = cursor.fetchone()
                column_value = row["stop_loss"]
                if column_value is None:
                    update_query = "UPDATE forward SET profit_one_percentage=%s, acheived_time=%s WHERE company_name=%s"
                    update_data = (float(profit_one_percentage), acheived_time, company_name)
                    cursor.execute(update_query, update_data)
                    print(f"Updated profit_one_percentage for {company_name}.")
                    connection.commit()

            elif stop_loss and stop_loss_time:
                cursor.execute("SELECT * FROM forward WHERE company_name = %s", (company_name,))
                row = cursor.fetchone()
                column_value = row["profit_one_percentage"]
                if column_value is None:
                    update_query = "UPDATE forward SET stop_loss=%s, stop_loss_time=%s WHERE company_name=%s"
                    update_data = (float(stop_loss), stop_loss_time, company_name)
                    cursor.execute(update_query, update_data)
                    print(f"Updated stop_loss for {company_name}.")
                    connection.commit()

    except OperationalError as e:
        print(f"OperationalError: {e}")
        if e.errno in [2006, 2013, 2055]:  # Lost connection, MySQL server has gone away, etc.
            reconnect()
            connect_to_mysql(company_name, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, profit_one_percentage, acheived_time, stop_loss, stop_loss_time, average)
    except Error as e:
        print(f"Error while executing SQL query: {e}")

def reverse(company_name, open_price=None, entry_price=None, entry_time=None, closing_price=None, closing_time=None, entry_volume=None, yesterday_volume=None, average=None, avg_percent=None,profit_one_percentage=None, acheived_time=None, stop_loss=None, stop_loss_time=None):
    global cursor, connection
    try:
        cursor.execute("SELECT * FROM reverse WHERE company_name = %s", (company_name,))
        row = cursor.fetchone()

        if not row:
            insert_query = """
                INSERT INTO reverse 
                (company_name, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, average,avg_percent)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
            """
            insert_values = (company_name, float(open_price), float(entry_price), entry_time, float(closing_price), closing_time, int(entry_volume), int(yesterday_volume), float(average),float(avg_percent) )
            cursor.execute(insert_query, insert_values)
            print(f"Inserted new record for {company_name}.")
            connection.commit()

        else:
            update_query = "UPDATE reverse SET closing_price=%s, closing_time=%s WHERE company_name=%s"
            update_data = (float(closing_price), closing_time, company_name)
            cursor.execute(update_query, update_data)
            connection.commit()

            if profit_one_percentage and acheived_time:
                cursor.execute("SELECT * FROM reverse WHERE company_name = %s", (company_name,))
                row = cursor.fetchone()
                column_value = row["stop_loss"]
                if column_value is None:
                    update_query = "UPDATE reverse SET profit_one_percentage=%s, acheived_time=%s WHERE company_name=%s"
                    update_data = (float(profit_one_percentage), acheived_time, company_name)
                    cursor.execute(update_query, update_data)
                    print(f"Updated profit_one_percentage for {company_name}.")
                    connection.commit()

            elif stop_loss and stop_loss_time:
                cursor.execute("SELECT * FROM reverse WHERE company_name = %s", (company_name,))
                row = cursor.fetchone()
                column_value = row["profit_one_percentage"]
                if column_value is None:
                    update_query = "UPDATE reverse SET stop_loss=%s, stop_loss_time=%s WHERE company_name=%s"
                    update_data = (float(stop_loss), stop_loss_time, company_name)
                    cursor.execute(update_query, update_data)
                    print(f"Updated stop_loss for {company_name}.")
                    connection.commit()

    except OperationalError as e:
        print(f"OperationalError: {e}")
        if e.errno in [2006, 2013, 2055]:  # Lost connection, MySQL server has gone away, etc.
            reconnect()
            connect_to_mysql(company_name, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, profit_one_percentage, acheived_time, stop_loss, stop_loss_time, average)
    except Error as e:
        print(f"Error while executing SQL query: {e}")

api = apidata_lib.ApiData()

async def main(date, entry, volume, average_percent, profit, loss):
    key = "4h67MWxZkADvtGSH89vZWo3wTvc="
    host = "apidata.accelpix.in"
    scheme = "http"
    author = await api.initialize(key, host, scheme)
    companies = pd.read_csv("filtered_cp.csv")
    cp = []
    remove = []
    str_to_date = datetime.strptime(date, "%Y%m%d")
    previous_day = str_to_date - timedelta(days=1)

    # Check if the previous_day is a working day (i.e., not a weekend)
    while previous_day.weekday() >= 5:  # Saturday and Sunday are 5 and 6
        previous_day -= timedelta(days=1)
    previous_working_day = previous_day.strftime("%Y%m%d")

    output_folder = "csv"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    if not os.path.exists("check_data"):
        os.makedirs("check_data")

    for company in companies["0"]:
        data = await api.get_back_ticks(company, f'{date} 09:07:00')
        cursor.execute("SELECT * FROM forward WHERE company_name = %s", (company,))
        row = cursor.fetchone()

        cursor.execute("SELECT * FROM reverse WHERE company_name = %s", (company,))
        dta=cursor.fetchone()


        if data:
            df = pd.DataFrame(data)
            df['tm'] = pd.to_datetime(df['tm'], unit='s')
            df['tm'] = df['tm'].dt.strftime('%H:%M:%S')
            df['tkr'] = company

            csv_path = os.path.join(output_folder, f"{company}.csv")
            df.to_csv(csv_path, index=False)

            df1 = pd.read_csv("vol_cp.csv")
            df2 = pd.read_csv(csv_path)
        else:
            remove.append(company)

        if len(df2) > 2 and len(df["tm"]) > 2:
            open_price = df2.at[0, 'pr']
        else:
            print(f"Not enough data for {company} to retrieve open price at index 2")
            continue

        df1_filtered = df1[df1['tkr'] == company]
        yesterday_volume = df1_filtered["vol"].values[0] if not df1_filtered.empty else 0

        if not df1_filtered.empty and not df2.empty:
            df2_filtered = df2[df2['tkr'] == company]
            data_path = os.path.join("check_data", f"{company}.csv")
            df2_filtered.to_csv(data_path, index=False)
            if not df2_filtered.empty:
                high = df2_filtered['pr'].max()
                low = df2_filtered['pr'].min()
                avg = df2_filtered['pr'].mean()
                a = high - low
                b = avg - low
                c = open_price-low
                average = ((c +b)/(c+a)) * 100

                ra = high - open_price
                rb = high - avg 
                rc=high-low
                raverage = ((ra+rb)/(ra+rc)) * 100
                
                if raverage <=average_percent or dta :
                    reverse_entry_percent= 1 - (entry / 100)
                    reverse_profit_percent= 1 + (profit / 100)
                    reverse_loss_percent= 1 - (loss / 100)
                    print(raverage)
                    higher_prices = df2_filtered[(df2_filtered['pr'] <= open_price * reverse_entry_percent) & (df2_filtered['qt'].cumsum() > volume)]

                    if higher_prices.empty:
                        print(f"No higher prices found for {company}")
                        continue
                    
                    row_index = higher_prices.index[0]
                    entry_price = higher_prices.iloc[0]["pr"]
                    entry_time = higher_prices.iloc[0]["tm"]
                    entry_volume = df2_filtered.loc[:row_index, 'qt'].sum()

                    last_row = df2.tail(1)
                    closing_price = last_row["pr"].values[0]
                    closing_time = last_row["tm"].values[0]
                    reverse(company, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, avg,raverage)

                    df2_filtered = df2_filtered.iloc[row_index:]
                    onePercentDecrease = df2_filtered[df2_filtered['pr'] >= entry_price * reverse_profit_percent]
                    onePercentPrice = df2_filtered[df2_filtered['pr'] <= entry_price * reverse_loss_percent]
        

                    if not onePercentPrice.empty:
                        reverse(company, closing_price=closing_price, closing_time=closing_time, profit_one_percentage=onePercentPrice.iloc[0]['pr'], acheived_time=onePercentPrice.iloc[0]['tm'])

                    if not onePercentDecrease.empty:
                        reverse(company, closing_price=closing_price, closing_time=closing_time, stop_loss=onePercentDecrease.iloc[0]['pr'], stop_loss_time=onePercentDecrease.iloc[0]['tm'])
              
                if average >= average_percent or row:
                    entry_price_percent= 1 + (entry / 100)
                    profit_percent= 1 + (profit / 100)
                    loss_percent= 1 - (loss / 100)
                    print(avg, average)
                    higher_prices = df2_filtered[(df2_filtered['pr'] > open_price * entry_price_percent) & (df2_filtered['qt'].cumsum() > volume)]

                    if higher_prices.empty:
                        print(f"No higher prices found for {company}")
                        continue

                    row_index = higher_prices.index[0]
                    entry_price = higher_prices.iloc[0]["pr"]
                    entry_time = higher_prices.iloc[0]["tm"]
                    entry_volume = df2_filtered.loc[:row_index, 'qt'].sum()
                    last_row = df2.tail(1)
                    closing_price = last_row["pr"].values[0]
                    closing_time = last_row["tm"].values[0]
                    connect_to_mysql(company, open_price, entry_price, entry_time, closing_price, closing_time, entry_volume, yesterday_volume, avg,average)
                    df2_filtered = df2_filtered.iloc[row_index:]
                    onePercentPrice = df2_filtered[df2_filtered['pr'] >= entry_price * profit_percent]
                    onePercentDecrease = df2_filtered[df2_filtered['pr'] <= entry_price *loss_percent]

                    if not onePercentPrice.empty:
                        connect_to_mysql(company, closing_price=closing_price, closing_time=closing_time, profit_one_percentage=onePercentPrice.iloc[0]['pr'], acheived_time=onePercentPrice.iloc[0]['tm'])

                    if not onePercentDecrease.empty:
                        connect_to_mysql(company, closing_price=closing_price, closing_time=closing_time, stop_loss=onePercentDecrease.iloc[0]['pr'], stop_loss_time=onePercentDecrease.iloc[0]['tm'])
                    cp.append(company)

                else:
                    print(f"Average for {company} is less than 60")
            else:
                print(f"No data found for {company}")
        else:
            print(f"No data found for {company}")
    pass


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

@app.route('/history-forward', methods=['GET'])
def get_history_forward_data():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM forward")
        data = cursor.fetchall()
        return jsonify(data)
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/history-reverse', methods=['GET'])
def get_history_reverse_data():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM reverse")
        data = cursor.fetchall()
        return jsonify(data)
    except Error as e:
        return jsonify({"error": f"Error fetching data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/clear-table', methods=['POST','GET'])
def clear_table():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor()
        status = request.form.get('request')
        if status=='forward':
            cursor.execute("DELETE FROM modification_data")
            connection.commit()
            return jsonify("success")
        elif status=='reverse':
            cursor.execute("DELETE FROM reverse_data")
            connection.commit()
            return jsonify("success")
        elif status=='history-forward':
            cursor.execute("DELETE FROM forward")
            connection.commit()
            return jsonify("success")
        elif status=='history-reverse':
            cursor.execute("DELETE FROM reverse")
            connection.commit()
            return jsonify("success")
        elif status=='submit':
            cursor.execute("DELETE FROM reverse")
            connection.commit()
            cursor.execute("DELETE FROM forward")
            connection.commit()
            return jsonify("success")
    except Error as e:
        return jsonify({"error": f"Error clearing data from MySQL: {e}"}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/start-trading', methods=['POST'])
def start_trading():
    try:
        # Extract data from the request
        date = request.form.get('date')
        open_price = float(request.form.get('open_price'))
        volume = int(request.form.get('volume'))
        average = float(request.form.get('average'))
        profit = float(request.form.get('profit'))
        loss = float(request.form.get('loss'))

        # Initialize MySQL connection
        initialize_connection()

        # Run the main function asynchronously
        asyncio.run(main(date, open_price, volume, average, profit, loss))

        # Close MySQL connection
        close_connection()

        return jsonify({"message": "Trading started successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
