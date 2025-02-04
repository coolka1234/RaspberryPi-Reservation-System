from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from datetime import datetime
from database_operations import (
    get_rooms, table_reservation, get_room_by_id, create_room, find_reservation, get_reservations, create_reservation, get_user_by_uid, handle_card_read, delete_room, delete_reservation, update_room, update_reservation
)

app = Flask(__name__)
api = Api(app)

def reload_rooms():
    return get_rooms()

def reload_reservations():
    return get_reservations()

#CRUD ROOMS
class RoomResource(Resource):
    def get(self):
        """Retrieve all rooms."""
        room_id = request.args.get("id")  # Retrieve the 'id' parameter from query string
        if room_id:
            room = get_room_by_id(room_id)
            if room:
                return room
            return {"error": "Room not found."}, 404
        else:
            rooms = reload_rooms()
            return rooms
    

    def post(self):
        """Create a new room."""
        data = request.get_json()
        number = data.get("number")
        equipment = data.get("equipment")
        capacity = data.get("capacity")

        if not (number and equipment and capacity):
            return {"error": "Missing required fields."}, 400

        create_room(number, equipment, capacity)
        return {"message": "Room created successfully."}, 201

    def put(self):
        """Update an existing room."""
        data = request.get_json()
        print("Received data:", data)  # Print the received data for debugging

        room_id = data.get("id")
        updated_fields = {
            key: data[key]
            for key in ["number", "equipment", "capacity", "is_active"]
            if key in data
        }

        if not room_id or not updated_fields:
            return {"error": "Missing room ID or fields to update."}, 400

        update_room(room_id, **updated_fields)
        return {"message": "Room updated successfully."}, 200


    def delete(self):
        """Delete a room by ID."""
        data = request.get_json()
        room_id = data.get("id")

        if not room_id:
            return {"error": "Room ID is required."}, 400

        delete_room(room_id)
        return {"message": "Room deleted successfully."}, 200

# CRUD RESERVATIONS
class ReservationResource(Resource):
    def get(self):
        """Retrieve reservations or find a specific reservation."""
        reservation_id = request.args.get("id")  # Retrieve 'id' from query string
        user_id = request.args.get("user_id")  # Retrieve 'user_id' from query string
        room_id = request.args.get("room_id")  # Retrieve 'room_id' from query string
        read_time = request.args.get("read_time")  # Retrieve 'read_time' from query string

        # Check for specific parameters to find a reservation
        if user_id and room_id and read_time:
            try:
                # Convert read_time to datetime
                read_time = datetime.fromisoformat(read_time)

                # Find the reservation using the helper function
                reservation = find_reservation(room_id=int(room_id), user_id=int(user_id), read_time=read_time)

                if reservation:
                    # Convert result to dictionary
                    columns = [column.name for column in table_reservation.columns]
                    reservation_dict = dict(zip(columns, reservation))
                    return jsonify(reservation_dict)

                return {"error": "Reservation not found."}, 404
            except ValueError:
                return {"error": "Invalid date format for read_time."}, 400

        # Fetch a single reservation by ID
        if reservation_id:
            reservation = next((res for res in reload_reservations() if res['id'] == int(reservation_id)), None)
            if reservation:
                return jsonify(reservation)
            return {"error": "Reservation not found."}, 404

        # Fetch all reservations if no specific parameter is provided
        reservations = reload_reservations()
        return jsonify(reservations)


    def post(self):
        """Create a new reservation."""
        data = request.get_json()
        fk_user = data.get("fk_user")
        fk_room = data.get("fk_room")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not (fk_user and fk_room and start_date and end_date):
            return {"error": "Missing required fields."}, 400

        create_reservation(fk_user, fk_room, start_date, end_date)
        return {"message": "Reservation created successfully."}, 201

    def put(self):
        """Update an existing reservation."""
        data = request.get_json()
        reservation_id = data.get("id")
        updated_fields = {
            key: data[key]
            for key in ["fk_user", "fk_room", "start_date", "end_date", "is_realized"]
            if key in data
        }

        if not reservation_id or not updated_fields:
            return {"error": "Missing reservation ID or fields to update."}, 400

        update_reservation(reservation_id, **updated_fields)
        return {"message": "Reservation updated successfully."}, 200

    def delete(self):
        """Delete a reservation by ID."""
        data = request.get_json()
        reservation_id = data.get("id")

        if not reservation_id:
            return {"error": "Reservation ID is required."}, 400

        delete_reservation(reservation_id)
        return {"message": "Reservation deleted successfully."}, 200

# ADDING RESOURCES TO API 
api.add_resource(RoomResource, "/rooms")
api.add_resource(ReservationResource, "/reservations")

if __name__ == "__main__":
    app.run(debug=True)
