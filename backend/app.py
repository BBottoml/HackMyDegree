import json
import os 
from flask import Flask, request
from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os.path import join, dirname
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# prepared statement client setup
app.config['MYSQL_HOST'] = os.environ.get("DB_HOST")
app.config['MYSQL_USER'] = os.environ.get("DB_UNAME")
app.config['MYSQL_PASSWORD'] = os.environ.get("DB_PASSWORD")
app.config['MYSQL_DB'] = os.environ.get("DB_NAME")

mysql = MySQL(app)

# sqlAlchemy setup (ORM)
URI = 'mysql://' + os.environ.get("DB_UNAME") + ':' + os.environ.get("DB_PASSWORD") + '@' + os.environ.get("DB_HOST")
USE_DB = 'USE ' + os.environ.get("DB_NAME")
app.config['SQLALCHEMY_DATABASE_URI'] = URI
db = SQLAlchemy(app)
engine = db.engine
engine.execute(USE_DB)

Session = db.sessionmaker(bind=engine)

# models
user_courses = db.Table(
   'User_Course', db.metadata, 
   db.Column('user_id', db.Integer), 
   db.Column('course_id', db.String) 
)

user_tracks = db.Table(
   'User_Track', db.metadata, 
   db.Column('user_id', db.Integer), 
   db.Column('track_id', db.String) 
)

@app.route("/api/courses", methods=["GET"])
def get_courses():
    sess = Session(bind=engine)
    sess.connection(execution_options={'isolation_level': 'READ COMMITTED'})

    sess.execute(USE_DB)
    id, name = db.Column('course_id'), db.Column('course_title')
    q = db.select([id.label('id'), name.label('name')]).select_from(db.text('Course'))
    result = sess.execute(q)
    sess.commit()
    sess.close()

    return orm_result_to_json(result)

@app.route("/api/tracks", methods=["GET"])
def get_tracks():
    sess = Session(bind=engine)
    sess.connection(execution_options={'isolation_level': 'READ COMMITTED'})

    sess.execute(USE_DB)
    id, name = db.Column('track_id'), db.Column('track_name')
    q = db.select([id.label('id'), name.label('name')]).select_from(db.text('Track'))
    result = sess.execute(q)
    sess.commit()
    sess.close()

    return orm_result_to_json(result)

'''
@app.route("/api/hours", methods=["POST"])
def get_hours():
    data = request.get_json()
    user_id = data["user_id"]

    cur = mysql.connection.cursor() 
    cur.execute("SELECT max_hours as hours FROM User WHERE user_id = %s", (user_id, ))
    hours = cur.fetchone()[0]
    return json.dumps({'hours': hours})
'''

@app.route("/api/add/courses", methods=["POST"])
def add_courses(): 
    data = request.get_json()
    uid = data["user_id"]
    courses = data["courses"]

    sess = Session(bind=engine)
    sess.connection(execution_options={'isolation_level': 'REPEATABLE READ'})

    sess.execute(USE_DB)

    q = user_courses.delete(None).where(user_courses.c.user_id == uid)
    sess.execute(q)

    for course in courses:
        q = user_courses.insert(None).values(user_id=uid, course_id=course)
        sess.execute(q) 
    sess.commit()
    sess.close()

    return json.dumps({'status': 'valid'})

@app.route("/api/add/tracks", methods=["POST"])
def add_tracks(): 
    
    data = request.get_json()

    uid = data["user_id"]
    tracks = data["tracks"]

    sess = Session(bind=engine)
    sess.connection(execution_options={'isolation_level': 'REPEATABLE READ'})
    
    sess.execute(USE_DB)
    q = user_tracks.delete(None).where(user_tracks.c.user_id == uid)
    sess.execute(q)

    for track in tracks:
        q = user_tracks.insert(None).values(user_id=uid, track_id=track)
        sess.execute(q) 
    sess.commit()
    sess.close()

    return json.dumps({'status': 'valid'})

'''
@app.route("/api/add/hours", methods=["POST"])
def add_hours():
    data = request.get_json()
    user_id = data["user_id"]
    hours = data["hours"]
    
    cur = mysql.connection.cursor()
    cur.execute("UPDATE User SET max_hours= %s WHERE user_id = %s", (hours, user_id))
    mysql.connection.commit()
    cur.close() 
    
    return json.dumps({'status': 'valid'})
''' 

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
    cur.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;")
    cur.execute("START TRANSACTION;")
    cur.execute("INSERT INTO User(email, password) VALUES (%s, PASSWORD(%s))", (email, pswd))
    cur.execute("COMMIT;")

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
    cur.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED;")
    cur.execute("START TRANSACTION;")
    cur.execute("SELECT user_id FROM User WHERE email = %s AND PASSWORD(%s) = password", (email, pswd))
    result = cur.fetchone()
    cur.execute("COMMIT;")
    
    if result is None or result == ():
        return json.dumps({'status': 'invalid'})
    
    user_id = int(result[0])
    return json.dumps({'status': 'valid', 'user_id': user_id})

@app.route("/api/compute", methods=["POST"])
def compute_schedule():
    data = request.get_json()
    user_id = data["user_id"]

    cur = mysql.connection.cursor()
    cur.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;")
    cur.execute("START TRANSACTION;")
    cur.execute("""
                SELECT Track_Req.track_id, Track_Req.course_id, Track_Req.track_req_id, Professor.score
                FROM Track_Req
                        LEFT JOIN Professor_Course ON Professor_Course.course_id = Track_Req.course_id
                        LEFT JOIN Professor ON Professor_Course.prof_id = Professor.prof_id

                WHERE Track_Req.track_id IN (SELECT track_id FROM User_Track WHERE user_id = %s)
                AND Track_Req.track_req_id NOT IN
                    (SELECT TR.track_req_id
                    FROM User_Course UR
                                INNER JOIN Track_Req TR ON TR.course_id = UR.course_id
                    WHERE user_id = %s
                        AND TR.track_id = Track_Req.track_id
                    )

                GROUP BY Track_Req.track_id, Track_Req.course_id, track_req_id, Professor.score
                HAVING MAX(Professor.score)
                ORDER BY Professor.score DESC;
                """, (user_id,user_id)) # this returns the needed courses sorted by professor RMT score to complete tracks
    results = cur.fetchall()
    
    req_courses = {} # course_id -> track_id 
    track_map = {}

    for result in results:
        block = result[2] 
        if result[0] in track_map:
            if block in track_map[result[0]]:
                continue
        else:
            track_map[result[0]] = set() # set of blocks

        track_map[result[0]].add(block)
        if result[1] in req_courses:
            req_courses[result[1]].add(result[0])
        else:
            req_courses[result[1]] = set()
            req_courses[result[1]].add(result[0])

    cur.execute("""
                SELECT TR.track_id,
                Track.num_electives,
                TR.track_el_id,
                TR.course_id,
                (SELECT COUNT(Track_Elective.course_id)
                    FROM Track_Elective
                    WHERE TR.course_id = Track_Elective.course_id
                    AND Track_Elective.track_id IN (SELECT track_id FROM User_Track WHERE user_id = %s)) as cnt

                FROM Track_Elective TR
                        INNER JOIN Track ON TR.track_id = Track.track_id
                WHERE TR.track_id IN (SELECT track_id FROM User_Track WHERE user_id = %s)
                GROUP BY TR.track_id, Track.num_electives, TR.track_el_id, TR.course_id
                ORDER BY cnt DESC;
                """, (user_id, user_id))
    results = cur.fetchall()
    cur.execute("COMMIT;")

    completed_courses = [] 
    cur.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED;")
    cur.execute("START TRANSACTION;")
    cur.execute("""
                SELECT User_Course.course_id, Track_Req.track_id
                FROM User_Course 
                INNER JOIN Track_Req ON User_Course.course_id=Track_Req.course_id
                WHERE user_id = %s
                """, (user_id,))
    completed_courses_cur = cur.fetchall() 
    cur.execute("COMMIT;")

    completed_courses = {}
    for completed_course in completed_courses_cur:
        if completed_course[0] not in completed_courses:
            completed_courses[completed_course[0]] = set()
        completed_courses[completed_course[0]].add(completed_course[1])

    track_elective_block = {} 
    track_elective_num = {} 
    electives = set()

    elective_map = {}
    chosen_results = {}
    for result in results: # construct elective_map 
        if result[3] not in elective_map:
            elective_map[result[3]] = set() 
        elective_map[result[3]].add(result)

    # count all possible previously taken required courses of one track towards electives of another
    chosen_results, track_elective_block, track_elective_num = scheduling_algo_helper(completed_courses, elective_map, chosen_results, track_elective_block, track_elective_num)
    
    print(chosen_results)

    # count all possible required courses (to be taken) of one track towards electives of another
    chosen_results, track_elective_block, track_elective_num = scheduling_algo_helper(req_courses, elective_map, chosen_results, track_elective_block, track_elective_num)
    
    print(chosen_results)
    for result in results:
        course_id = result[3] 
        block_id = result[2]
        track_id = result[0] 

        if track_id in chosen_results and course_id in chosen_results[track_id]:
            continue

        if block_id is None:
            if track_id in track_elective_num:
                remaining_courses = track_elective_num[track_id]
                if remaining_courses == 0:
                    continue
            else:
                track_elective_num[track_id] = result[1]
                remaining_courses = result[1]
            
            if course_id in req_courses and track_id in req_courses[course_id]:
                continue # a required course cannot count towards an elective
            track_elective_num[track_id] -= 1
            electives.add(course_id)
        else:
            if track_id in track_elective_block:
                if block_id in track_elective_block[track_id]:
                    continue 
            else:
                track_elective_block[track_id] = set()
            
            if course_id in req_courses and track_id in req_courses[course_id]:
                continue # a required course cannot count towards an elective
            track_elective_block[track_id].add(block_id)
            electives.add(course_id)

    courses = []
    for key,values in req_courses.items():
        courses.append(key) 
    
    for elective in electives:
        courses.append(elective)
    
    # Uncomitted used here since course table will rarely every change
    cur.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;")
    cur.execute("START TRANSACTION;")
    course_names = []
    for course in courses:
        cur.execute("""
                    SELECT Course.course_title as name
                    FROM Course
                    WHERE course_id=%s
                    """, (course,))
        result = cur.fetchone()
        course_names.append(result[0])
    cur.execute("COMMIT;")
    cur.close()
    
    return json.dumps({'courses': course_names})

@app.route("/api/users/stats", methods=["GET"])
def users_tracks():
    cur = mysql.connection.cursor()
    cur.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;")
    cur.execute("START TRANSACTION;")
    cur.execute("""
                SELECT email, track_name
                FROM User
                INNER JOIN User_Track ON User.user_id=User_Track.user_id
                INNER JOIN Track ON User_Track.track_id=Track.track_id
                """)
    results = cur.fetchall()
    cur.execute("COMMIT;")
    cur.close()

    users = []
    user_map = {} 
    
    for result in results:
        if result[0] not in user_map:
            user_map[result[0]] = []
        user_map[result[0]].append(result[1])
    
    for key,value in user_map.items():
        curr_map = {}
        curr_map["name"] = key 
        curr_map["courses"] = value
        users.append(curr_map)

    return json.dumps(users)

def user_exists(email):
    cur = mysql.connection.cursor()

    cur.execute("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;")
    cur.execute("START TRANSACTION;")
    query = "SELECT user_id FROM User WHERE email = %s"
    cur.execute(query, (email,))
    result = cur.fetchall()
    cur.execute("COMMIT;")

    cur.close()
    return result != ()

def orm_result_to_json(result):
    arr = []
    for row in result:
        row_map = dict()
        for column, value in row.items():
            row_map[column] = value
        arr.append(row_map)
    return json.dumps(arr)

def scheduling_algo_helper(course_dict, elective_map, chosen_results, track_elective_block, track_elective_num):
    for c_id, t_id in course_dict.items():
        if c_id not in elective_map:
            continue

        potential_matches = elective_map[c_id]
        for match in potential_matches: 
            course_id = match[3] 
            block_id = match[2]
            track_id = match[0]

            if track_id in t_id:
                continue # a required course cannot count towards an elective

            if block_id is None:
                if track_id in track_elective_num:
                    remaining_courses = track_elective_num[track_id]
                    if remaining_courses == 0:
                        continue
                else:
                    track_elective_num[track_id] = match[1]
                    remaining_courses = match[1]
                
                track_elective_num[track_id] -= 1
            else:
                if track_id in track_elective_block:
                    if block_id in track_elective_block[track_id]:
                        continue 
                else:
                    track_elective_block[track_id] = set()
                
                track_elective_block[track_id].add(block_id)
            
            if track_id not in chosen_results:
                chosen_results[track_id] = set()
            chosen_results[track_id].add(course_id)
    return chosen_results, track_elective_block, track_elective_num

# DEPRECATED: No longer needed since certain queries now executed using ORM
'''
This function transforms SQL result to JSON for response
Credit: https://stackoverflow.com/questions/43796423/python-converting-mysql-query-result-to-json
'''
def transform_to_json(cur):
    row_headers=[x[0] for x in cur.description] 
    results = cur.fetchall()
    json_data=[]
    for result in results:
        json_data.append(dict(zip(row_headers,result)))
    cur.close()
    return json.dumps(json_data)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
