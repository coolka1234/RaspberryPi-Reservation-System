from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from database_operations import (
    find_reservation_for_room,
    get_rooms,
    create_room,
    get_reservations,
    create_reservation,
    get_room_by_id,
    delete_room,
    delete_reservation,
    update_room,
    update_reservation,
)

app = Flask(__name__)
api = Api(app)


def reload_rooms():
    return get_rooms()


def reload_reservations():
    return get_reservations()


# CRUD ROOMS
class RoomResource(Resource):
    def get(self, id=None):
        """Retrieve all rooms."""
        if id is not None:
            room = get_room_by_id(id)

            if room is None:
                return {"error": f"Room with ID {id} not found."}, 404

            return jsonify(room)

        rooms = reload_rooms()
        return jsonify(rooms)

    def post(self):
        """Create a new room."""
        data = request.get_json()
        number = data.get("number")
        equipment = data.get("equipment")
        capacity = data.get("capacity")

        if any((field is None for field in [number, equipment, capacity])):
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
    def get(self, room_id=None):
        """Retrieve all reservations."""
        if room_id is not None:
            reservations = find_reservation_for_room(room_id)
            return jsonify(reservations)

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
api.add_resource(RoomResource, "/rooms", "/rooms/<int:id>")
api.add_resource(ReservationResource, "/reservations", "/reservations/<int:room_id>")

if __name__ == "__main__":
    app.run(debug=True)
