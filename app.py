from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlalchemy

app = Flask(__name__)
CORS(app)

# db connection here
YOUR_POSTGRES_PASSWORD = "postgres"
connection_string = f"postgresql://postgres:{YOUR_POSTGRES_PASSWORD}@localhost/postgres"
engine = sqlalchemy.create_engine(
    "postgresql://postgres:postgres@localhost/postgres"
)

db = engine.connect()

@app.post("/api/customer/login")
def login_customer():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    query = f"SELECT * FROM users WHERE email='{email}' AND password='{password}'"
    result = db.execute(sqlalchemy.text(query)).fetchone()
    print("user_id: ", result[0])
    if result:
        query = f"SELECT * FROM customers WHERE user_id={result[0]}"
        res = db.execute(sqlalchemy.text(query)).fetchone()
        response = {
            "success": True,
            "customer": {
                "customer_id": res[0],
                "name": res[2],
                "contact": res[3],
            }
        }
        return jsonify(response), 200
    else:
        response = {
            "success": False,
            "message": "Invalid email or password"
        }
        return jsonify(response), 401
    
@app.post("/api/owner/login")
def login_owner():
    print("ownerlogin is called")
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    query = f"SELECT * FROM users WHERE email='{email}' AND password='{password}'"
    result = db.execute(sqlalchemy.text(query)).fetchone()
    print("user_id: ", result[0])
    if result:
        query = f"SELECT * FROM owners WHERE user_id={result[0]}"
        res = db.execute(sqlalchemy.text(query)).fetchone()
        print("owner details: ", res)
        response = {
            "success": True,
            "owner": {
                "owner_id": res[0],
                "name": res[2],
                "contact": res[3],
            }
        }
        return jsonify(response), 200
    else:
        response = {
            "success": False,
            "message": "Invalid email or password"
        }
        return jsonify(response), 401    

@app.post("/api/customer/create")
def create_customer():
    data = request.get_json()

    name = data.get("name")
    contact = data.get("contact")
    email = data.get("email")
    password = data.get("password")

    # Check if user with given email already exists
    query = f"SELECT * FROM customers WHERE email='{email}'"
    result = db.execute(sqlalchemy.text(query)).fetchone()
    if result:
        response = {
            "success": False,
            "message": "User with given email already exists"
        }
        return jsonify(response), 409
    # Insert new user into database
    query = f"SELECT MAX(user_id) from users"
    user_id = db.execute(sqlalchemy.text(query)).fetchone()[0] + 1
    query = f"SELECT MAX(customer_id) from customers"
    customer_id = db.execute(sqlalchemy.text(query)).fetchone()[0] + 1
    query = f"INSERT INTO users (user_id, email, password) VALUES ('{user_id}', '{email}', '{password}')"
    db.execute(sqlalchemy.text(query))
    db.commit()
    query = f"INSERT INTO customers (customer_id, user_id, name, contact, email) VALUES ('{customer_id}', '{user_id}', '{name}', '{contact}', '{email}')"
    db.execute(sqlalchemy.text(query))
    db.commit()
    response = {
        "success": True,
        "message": "Account created successfully"
    }
    return jsonify(response), 201

@app.post("/api/owner/create")
def create_owner():
    data = request.get_json()

    name = data.get("name")
    contact = data.get("contact")
    email = data.get("email")
    password = data.get("password")

    # Check if user with given email already exists
    query = f"SELECT * FROM owners WHERE email='{email}'"
    result = db.execute(sqlalchemy.text(query)).fetchone()
    if result:
        response = {
            "success": False,
            "message": "User with given email already exists"
        }
        return jsonify(response), 409
    # Insert new user into database
    query = f"SELECT MAX(user_id) from users"
    user_id = db.execute(sqlalchemy.text(query)).fetchone()[0] + 1
    query = f"SELECT MAX(owner_id) from owners"
    owner_id = db.execute(sqlalchemy.text(query)).fetchone()[0] + 1
    query = f"INSERT INTO users (user_id, email, password) VALUES ('{user_id}', '{email}', '{password}')"
    db.execute(sqlalchemy.text(query))
    db.commit()
    query = f"INSERT INTO customers (customer_id, user_id, name, contact, email) VALUES ('{owner_id}', '{user_id}', '{name}', '{contact}', '{email}')"
    db.execute(sqlalchemy.text(query))
    db.commit()
    response = {
        "success": True,
        "message": "Account created successfully"
    }
    return jsonify(response), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    print('get_users is called')
    statement = 'SELECT email, password FROM users'
    test = db.execute(sqlalchemy.text(statement))
    result = db.execute(sqlalchemy.text(statement)).fetchall()
    users = []
    for row in result:
        user = {'email': row[0], 'password': row[1]}
        users.append(user)
    return jsonify(users)

@app.post('/api/cars')
def search_cars():
    print('cars is called')
    data = request.get_json()
    pickupLocation = data.get('pickupLocation')
    seatCapacity = data.get('seatCapacity')
    statement = f'SELECT * FROM cars WHERE pickup_location=\'{pickupLocation}\' and seat_capacity=\'{seatCapacity}\''
    result = db.execute(sqlalchemy.text(statement)) 
    rows = []
    columns = list(result.keys())
    for row_number, row in enumerate(result):
        rows.append({})
        for column_number, value in enumerate(row):
            rows[row_number][columns[column_number]] = value
    return jsonify(rows)

@app.post('/api/postcar')
def post_cars():
    data = request.get_json()
    owner_id = data.get('owner_id')
    makeModel = data.get('makeModel')
    pickupLocation = data.get('pickupLocation')
    seatCapacity = data.get('seatCapacity')
    rentalRate = data.get('rentalRate')
    # insert
    query = f"SELECT MAX(car_id) from cars"
    car_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
    statement = f"INSERT INTO cars VALUES ('{car_id}', '{makeModel}', '{seatCapacity}', '{pickupLocation}', '{rentalRate}')"
    db.execute(sqlalchemy.text(statement)) 
    db.commit()
    statement = f"INSERT INTO car_owner VALUES ('{car_id}', '{owner_id}')"
    db.execute(sqlalchemy.text(statement)) 
    db.commit()
    response = {
        "success": True,
        "message": "Car posted successfully"
    }
    return jsonify(response), 201

@app.post('/api/getcars')
def get_cars():
    owner_id = request.get_json()
    # insert
    statement = f"SELECT c.make_model, c.seat_capacity, c.pickup_location, c.rental_rate FROM cars c, car_owner co WHERE c.car_id = co.car_id AND co.owner_id = {owner_id}"
    result = db.execute(sqlalchemy.text(statement)) 
    rows = []
    columns = list(result.keys())
    for row_number, row in enumerate(result):
        rows.append({})
        for column_number, value in enumerate(row):
            rows[row_number][columns[column_number]] = value
    return jsonify(rows)

@app.post('/api/rentcar')
def rent_cars():
    data = request.get_json()
    customer_id = data.get('customer_id')
    car_id = data.get('car_id')
    rental_days = data.get('rentalDays')
    total_cost = data.get('rentalCost')
    # insert
    query = f"SELECT MAX(rental_id) from rental"
    rental_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
    statement = f"INSERT INTO rental VALUES ('{rental_id}', '{customer_id}', '{car_id}', '{rental_days}', '{total_cost}')"
    db.execute(sqlalchemy.text(statement)) 
    db.commit()
    response = {
        "success": True,
        "message": "Car rented successfully"
    }
    return jsonify(response), 201

@app.post('/api/getorders')
def get_orders():
    data = request.get_json()
    user_type = data.get("userType")
    id = data.get("id")
    if user_type == 'customer':
        statement = f"SELECT c.make_model, c.pickup_location, r.rental_days, r.total_cost, o.contact FROM rental r, cars c, car_owner co, owners o WHERE c.car_id = r.car_id AND c.car_id = co.car_id AND co.owner_id = o.owner_id AND r.customer_id = {id}"
        result = db.execute(sqlalchemy.text(statement)) 
        rows = []
        columns = list(result.keys())
        for row_number, row in enumerate(result):
            rows.append({})
            for column_number, value in enumerate(row):
                rows[row_number][columns[column_number]] = value
        return jsonify(rows)
    
    else: #owner
        statement = f"SELECT c.make_model, c.pickup_location, r.rental_days, r.total_cost, cu.contact FROM rental r, cars c, customers cu, car_owner co, owners o WHERE c.car_id = r.car_id AND c.car_id = co.car_id AND co.owner_id = o.owner_id AND r.customer_id = cu.customer_id AND o.owner_id = {id}"
        result = db.execute(sqlalchemy.text(statement)) 
        rows = []
        columns = list(result.keys())
        for row_number, row in enumerate(result):
            rows.append({})
            for column_number, value in enumerate(row):
                rows[row_number][columns[column_number]] = value
        return jsonify(rows)

# ? This method can be used by waitress-serve CLI 
def create_app():
   return app

# ? The port where the debuggable DB management API is served
PORT = 2222
# ? Running the flask app on the localhost/0.0.0.0, port 2222
# ? Note that you may change the port, then update it in the view application too to make it work (don't if you don't have another application occupying it)

# @app.route("/")
# def hello_world():
#     return "Hello, World!"

if __name__ == "__main__":
    app.run("0.0.0.0", PORT)
    # ? Uncomment the below lines and comment the above lines below `if __name__ == "__main__":` in order to run on the production server
    # ? Note that you may have to install waitress running `pip install waitress`
    # ? If you are willing to use waitress-serve command, please add `/home/sadm/.local/bin` to your ~/.bashrc
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=PORT)