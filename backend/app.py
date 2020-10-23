import json
import os 
from flask import Flask, request
from flask_mysqldb import MySQL
from flask_cors import CORS
from os.path import join, dirname
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

app.config['MYSQL_HOST'] = os.environ.get("DB_HOST")
app.config['MYSQL_USER'] = os.environ.get("DB_UNAME")
app.config['MYSQL_PASSWORD'] = os.environ.get("DB_PASSWORD")
app.config['MYSQL_DB'] = os.environ.get("DB_NAME")

mysql = MySQL(app)

@app.route("/api/courses", methods=["GET"])
def get_courses():
    cur = mysql.connection.cursor()
    cur.execute("SELECT course_id as id, course_title as name FROM Course")
    return transform_to_json(cur)

@app.route("/api/register", methods=["POST"])
def sign_up():
    data = request.get_json()
    email = data["email"]
    pswd = data["pswd"]

    # determine if user already exists
    if user_exists(email):
        return json.dumps({'status': 'invalid'})
    
    # insert into user table
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO User(email, password) VALUES (%s, PASSWORD(%s))", (email, pswd))
    mysql.connection.commit()
    cur.close()
    return json.dumps({'status': 'valid'})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    pswd = data["pswd"]

    if user_exists(email) == False:
        return json.dumps({'status': 'invalid'})
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id FROM User WHERE email = %s AND PASSWORD(%s) = password", (email, pswd))
    result = cur.fetchone()
    if result == None or result == ():
        return json.dumps({'status': 'invalid'})
    
    user_id = int(result[0])
    return json.dumps({'status': 'valid', 'user_id': user_id})

def user_exists(email):
    cur = mysql.connection.cursor()
    query = "SELECT user_id FROM User WHERE email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    cur.close()
    return result != ()

'''
This function transforms SQL result to JSON for response
Credit: https://stackoverflow.com/questions/43796423/python-converting-mysql-query-result-to-json
'''
def transform_to_json(cur):
    row_headers=[x[0] for x in cur.description] 
    result = cur.fetchall()
    json_data=[]
    for result in result:
        json_data.append(dict(zip(row_headers,result)))
    cur.close()
    return json.dumps(json_data)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
