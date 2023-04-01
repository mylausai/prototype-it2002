from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlalchemy

app = Flask(__name__)
CORS(app)

# db connection here
YOUR_POSTGRES_PASSWORD = "postgres"
connection_string = f"postgresql://postgres:{YOUR_POSTGRES_PASSWORD}@localhost:8001/postgres"
engine = sqlalchemy.create_engine(
    connection_string
)

db = engine.connect()

@app.after_request
def after_request(response):
    white_origin= ["http://localhost:5173"]
    if request.headers['Origin'] in white_origin:
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] 
        response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

@app.post("/api/customer/login")
def login_customer():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    try:
        # search for user based on email and password
        query = f"SELECT * FROM users WHERE email='{email}' AND password='{password}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        # if user found, retrieve customer details
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
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)
    
@app.post("/api/owner/login")
def login_owner():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    try:
        # search for user based on email and password
        query = f"SELECT * FROM users WHERE email='{email}' AND password='{password}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        # if user found, retrieve owner details
        if result:
            print(result)
            query = f"SELECT * FROM owners WHERE user_id={result[0]}"
            res = db.execute(sqlalchemy.text(query)).fetchone()
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
    except Exception as e:
        print(e)
        db.rollback()
        return Response(str(e), 403)
    
@app.post("/api/customer/create")
def create_customer():
    data = request.get_json()

    name = data.get("name")
    contact = data.get("contact")
    email = data.get("email")
    password = data.get("password")
    try:
        # Check if user with given email already exists
        query = f"SELECT * FROM customers WHERE email='{email}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        if result:
            response = {
                "success": False,
                "message": "User with given email already exists"
            }
            return jsonify(response), 409

        # Check if user with given contact number already exists
        query = f"SELECT * FROM customers WHERE contact='{contact}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        if result:
            response = {
                "success": False,
                "message": "User with given contact number already exists"
            }
            return jsonify(response), 409

        # Insert new user into database
        query = f"SELECT MAX(user_id) from users"
        user_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
        query = f"SELECT MAX(customer_id) from customers"
        customer_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
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
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)

@app.post("/api/owner/create")
def create_owner():
    data = request.get_json()

    name = data.get("name")
    contact = data.get("contact")
    email = data.get("email")
    password = data.get("password")
    try:
        # Check if user with given email already exists
        query = f"SELECT * FROM owners WHERE email='{email}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        if result:
            response = {
                "success": False,
                "message": "User with given email already exists"
            }
            return jsonify(response), 409

        # Check if user with given contact number already exists
        query = f"SELECT * FROM owners WHERE contact='{contact}'"
        result = db.execute(sqlalchemy.text(query)).fetchone()
        if result:
            response = {
                "success": False,
                "message": "User with given contact number already exists"
            }
            return jsonify(response), 409

        # Insert new user into database
        query = f"SELECT MAX(user_id) from users"
        user_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
        query = f"SELECT MAX(owner_id) from owners"
        customer_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
        query = f"INSERT INTO users (user_id, email, password) VALUES ('{user_id}', '{email}', '{password}')"
        db.execute(sqlalchemy.text(query))
        db.commit()
        query = f"INSERT INTO owners (owner_id, user_id, name, contact, email) VALUES ('{customer_id}', '{user_id}', '{name}', '{contact}', '{email}')"
        db.execute(sqlalchemy.text(query))
        db.commit()
        response = {
            "success": True,
            "message": "Account created successfully"
        }
        return jsonify(response), 201
    
    except Exception as e:
        print(e)
        db.rollback()
        return Response(str(e), 403)

@app.post('/api/cars')
def search_cars():
    data = request.get_json()
    pickupLocation = data.get('pickupLocation')
    seatCapacity = data.get('seatCapacity')
    print(pickupLocation,seatCapacity)
    try:
        if (pickupLocation is None) and (seatCapacity is None):
            statement = f'SELECT * FROM cars'
        elif (pickupLocation is None) and (seatCapacity is not None):
            statement = f'SELECT * FROM cars WHERE seat_capacity=\'{seatCapacity}\''
        elif (pickupLocation is not None) and (seatCapacity is None):
            statement = statement = f'SELECT * FROM cars WHERE pickup_location=\'{pickupLocation}\''
        else:
            statement = f'SELECT * FROM cars WHERE pickup_location=\'{pickupLocation}\' and seat_capacity=\'{seatCapacity}\''
        result = db.execute(sqlalchemy.text(statement)) 
        rows = []
        columns = list(result.keys())
        for row_number, row in enumerate(result):
            rows.append({})
            for column_number, value in enumerate(row):
                rows[row_number][columns[column_number]] = value
        return jsonify(rows)
    except Exception as e:
        print(e)
        db.rollback()
        return Response(str(e), 403)

@app.post('/api/postcar')
def post_cars():
    data = request.get_json()
    owner_id = data.get('owner_id')
    makeModel = data.get('makeModel')
    pickupLocation = data.get('pickupLocation')
    seatCapacity = data.get('seatCapacity')
    rentalRate = data.get('rentalRate')
    try:
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
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)
    
@app.post('/api/getcars') #cars of owner
def get_cars():
    owner_id = request.get_json()
    try:
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
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)
    
@app.post('/api/rentcar')
def rent_cars():
    data = request.get_json()
    customer_id = data.get('customer_id')
    print('rent custid: ', customer_id)
    car_id = data.get('car_id')
    rental_days = data.get('rentalDays')
    rental_cost = data.get('rentalCost')
    try:
        # insert the rental record into the database
        query = f"SELECT MAX(rental_id) from rental"
        rental_id = int(db.execute(sqlalchemy.text(query)).fetchone()[0] or 0) + 1
        query = f"INSERT INTO rental (rental_id, customer_id, car_id, rental_days, total_cost) VALUES ('{rental_id}', '{customer_id}', '{car_id}', '{rental_days}', '{rental_cost}')"
        db.execute(sqlalchemy.text(query))
        db.commit()
        response = {
            "success": True,
            "message": "Car rented successfully"
        }
        return jsonify(response), 201
    except Exception as e:
        print(e)
        db.rollback()
        return Response(str(e), 403)

@app.post('/api/getorders')
def get_orders():
    data = request.get_json()
    user_type = data.get('user_type')
    user_id = data.get('user_id')
    print('userType: ',user_type)
    print('userId: ', user_id)
    try:
        if user_type == 'customer':
            # retrieve rental records for the given customer
            query = f"SELECT c.make_model, c.pickup_location, r.rental_days, r.total_cost, o.contact FROM rental r, cars c, car_owner co, owners o WHERE c.car_id = r.car_id AND c.car_id = co.car_id AND co.owner_id = o.owner_id AND r.customer_id = {user_id}"
            result = db.execute(sqlalchemy.text(query))
            rows = []
            columns = list(result.keys())
            for row_number, row in enumerate(result):
                rows.append({})
                for column_number, value in enumerate(row):
                    rows[row_number][columns[column_number]] = value
            return jsonify(rows)
        else:
            # retrieve rental records for the given owner
            query = f"SELECT c.make_model, c.pickup_location, r.rental_days, r.total_cost, cu.contact FROM rental r, cars c, customers cu, car_owner co, owners o WHERE c.car_id = r.car_id AND c.car_id = co.car_id AND co.owner_id = o.owner_id AND r.customer_id = cu.customer_id AND o.owner_id = {user_id}"
            result = db.execute(sqlalchemy.text(query))
            rows = []
            columns = list(result.keys())
            for row_number, row in enumerate(result):
                rows.append({})
                for column_number, value in enumerate(row):
                    rows[row_number][columns[column_number]] = value
            return jsonify(rows)
    except Exception as e:
        print(e)
        db.rollback()
        return Response(str(e), 403)
    
# This method can be used by the waitress-serve CLI 
def create_app():
   return app

# The port where the debuggable DB management API is served
PORT = 2222

# Running the Flask app on the localhost/0.0.0.0, port 2222
if __name__ == "__main__":
    app.run("127.0.0.1", PORT)

