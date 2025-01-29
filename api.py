from datetime import datetime
import json

from flask import Flask, jsonify, request
from flask_restful import Api, Resource

from database_operations import (
    create_reservation,
    create_room,
    delete_reservation,
    delete_room,
    find_reservation,
    find_archived_reservations_for_room,
    find_reservations_by_user,
    get_reservations,
    get_room_by_id,
    get_rooms,
    log_in,
    table_reservation,
    table_room,
    update_reservation,
    update_room,
)

date_format = "%Y-%m-%d %H:%M"

app = Flask(__name__)
api = Api(app)


def reload_rooms():
    return get_rooms()


def reload_reservations():
    return get_reservations()


# USERS
class UserResource(Resource):
    def post(self):
        data = request.get_json()
        login = data.get("login")
        password = data.get("password")

        if login is None or password is None:
            return {"error": "Missing required fields."}, 400

        user = log_in(login, password)

        if user is None:
            return {"error": "Invalid credentials."}, 400

        return jsonify(
            {
                "id": user.id,
                "name": user.name,
                "surname": user.surname,
                "role": user.role,
            }
        )


# CRUD ROOMS
class RoomResource(Resource):
    columns = [
        *[column.name for column in table_room.columns],
        "reservations",
    ]

    def get(self, id=None):
        """Retrieve all rooms."""
        no_reservations = "[null]"

        if id:
            room = get_room_by_id(id)
            if room:
                result = dict(zip(self.columns, room))
                result["reservations"] = json.loads(
                    "[]"
                    if "reservations" not in result
                    or result["reservations"] == no_reservations
                    else result["reservations"]
                )

                status = "free"
                for reservation in result["reservations"]:
                    if reservation["is_realized"] and not reservation["is_finalized"]:
                        status = (
                            "overtime"
                            if datetime.strptime(reservation["end_date"], date_format)
                            < datetime.now()
                            else "taken"
                        )
                        break

                result["status"] = status

                return result
            return {"error": "Room not found."}, 404
        else:
            rooms = reload_rooms()

            result = [dict(zip(self.columns, room)) for room in rooms]
            for row in result:
                row["reservations"] = json.loads(
                    "[]"
                    if "reservations" not in row
                    or row["reservations"] == no_reservations
                    else row["reservations"]
                )

                status = "free"
                for reservation in row["reservations"]:
                    if reservation["is_realized"] and not reservation["is_finalized"]:
                        status = (
                            "overtime"
                            if datetime.strptime(reservation["end_date"], date_format)
                            < datetime.now()
                            else "taken"
                        )
                        break

                row["status"] = status

            return result

    def post(self):
        """Create a new room."""

        data = request.get_json()
        number = data.get("number")
        equipment = data.get("equipment")
        capacity = data.get("capacity")

        if number is None or equipment is None or capacity is None:
            return {"error": "Missing required fields."}, 400

        create_room(number, equipment, capacity)
        return {"message": "Room created successfully."}, 201

    def put(self):
        """Update an existing room."""

        data = request.get_json()
        print("Received data:", data)

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

    def delete(self, id=None):
        """Delete a room by ID."""

        if not id:
            return {"error": "Room ID is required."}, 400

        delete_room(id)
        return {"message": "Room deleted successfully."}, 200


# CRUD RESERVATIONS
class ReservationResource(Resource):
    columns = [
        *[column.name for column in table_reservation.columns],
        "name",
        "surname",
    ]

    def get(self):
        """Retrieve reservations or find a specific reservation."""

        user_id = request.args.get("user_id")
        room_id = request.args.get("room_id")

        if room_id is not None:
            reservations = find_archived_reservations_for_room(int(room_id))
            reservation_dict = [
                dict(zip(self.columns, reservation)) for reservation in reservations
            ]
            return jsonify(reservation_dict)

        if user_id is not None:
            reservations = find_reservations_by_user(int(user_id))
            reservation_dict = [
                dict(zip(["id", "start_date", "end_date", "room_number"], reservation))
                for reservation in reservations
            ]
            return jsonify(reservation_dict)

        reservations = reload_reservations()
        return jsonify(
            [dict(zip(self.columns, reservation)) for reservation in reservations]
        )

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

    def delete(self, id=None):
        """Delete a reservation by ID."""

        if not id:
            return {"error": "Reservation ID is required."}, 400

        delete_reservation(id)
        return {"message": "Reservation deleted successfully."}, 200


# ADDING RESOURCES TO API
api.add_resource(RoomResource, "/rooms", "/rooms/<id>")
api.add_resource(ReservationResource, "/reservations", "/reservations/<id>")
api.add_resource(UserResource, "/users")

if __name__ == "__main__":
    app.run(debug=True)
