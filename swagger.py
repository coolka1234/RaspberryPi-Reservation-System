from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields  # Importujemy Api i fields
from database_operations import (
    get_rooms, create_room, update_room, delete_room,
    get_reservations, create_reservation, update_reservation, delete_reservation
)

app = Flask(__name__)
api = Api(app, version="1.0", title="Reservation API",
          description="API for managing rooms and reservations with Swagger documentation")

# Namespace for rooms
room_ns = api.namespace("rooms", description="Room operations")

# Namespace for reservations
reservation_ns = api.namespace("reservations", description="Reservation operations")

# Swagger models for request validation
room_model = api.model('Room', {
    "id": fields.Integer(description="Room ID", example=1),
    "number": fields.String(required=True, description="Room number", example="101"),
    "equipment": fields.String(required=True, description="Room equipment", example="Projector, Whiteboard"),
    "capacity": fields.Integer(required=True, description="Room capacity", example=20),
    "is_active": fields.Boolean(description="Room active status", example=True),
})

reservation_model = api.model('Reservation', {
    "id": fields.Integer(description="Reservation ID", example=1),
    "fk_user": fields.Integer(required=True, description="User ID", example=1),
    "fk_room": fields.Integer(required=True, description="Room ID", example=2),
    "start_date": fields.String(required=True, description="Start date", example="2025-01-24 09:00:00"),
    "end_date": fields.String(required=True, description="End date", example="2025-01-24 10:00:00"),
    "is_realized": fields.Boolean(description="Reservation status", example=False),
})

# CRUD operations for rooms
@room_ns.route("/")
class RoomResource(Resource):
    @room_ns.doc("get_rooms")
    def get(self):
        """Retrieve all rooms."""
        rooms = get_rooms()
        return jsonify(rooms)

    @room_ns.expect(room_model)
    @room_ns.doc("create_room")
    def post(self):
        """Create a new room."""
        data = request.json
        create_room(
            number=data["number"],
            equipment=data["equipment"],
            capacity=data["capacity"]
        )
        return {"message": "Room created successfully."}, 201

    @room_ns.expect(room_model)
    @room_ns.doc("update_room")
    def put(self):
        """Update an existing room."""
        data = request.json
        room_id = data.get("id")
        if not room_id:
            return {"error": "Room ID is required."}, 400
        update_room(room_id, data)
        return {"message": "Room updated successfully."}, 200

    @room_ns.doc("delete_room")
    def delete(self):
        """Delete a room by ID."""
        data = request.json
        room_id = data.get("id")
        if not room_id:
            return {"error": "Room ID is required."}, 400
        delete_room(room_id)
        return {"message": "Room deleted successfully."}, 200

# CRUD operations for reservations
@reservation_ns.route("/")
class ReservationResource(Resource):
    @reservation_ns.doc("get_reservations")
    def get(self):
        """Retrieve all reservations."""
        reservations = get_reservations()
        return jsonify(reservations)

    @reservation_ns.expect(reservation_model)
    @reservation_ns.doc("create_reservation")
    def post(self):
        """Create a new reservation."""
        data = request.json
        create_reservation(
            fk_user=data["fk_user"],
            fk_room=data["fk_room"],
            start_date=data["start_date"],
            end_date=data["end_date"]
        )
        return {"message": "Reservation created successfully."}, 201

    @reservation_ns.expect(reservation_model)
    @reservation_ns.doc("update_reservation")
    def put(self):
        """Update an existing reservation."""
        data = request.json
        reservation_id = data.get("id")
        if not reservation_id:
            return {"error": "Reservation ID is required."}, 400
        update_reservation(reservation_id, data)
        return {"message": "Reservation updated successfully."}, 200

    @reservation_ns.doc("delete_reservation")
    def delete(self):
        """Delete a reservation by ID."""
        data = request.json
        reservation_id = data.get("id")
        if not reservation_id:
            return {"error": "Reservation ID is required."}, 400
        delete_reservation(reservation_id)
        return {"message": "Reservation deleted successfully."}, 200

if __name__ == "__main__":
    app.run(debug=True)
