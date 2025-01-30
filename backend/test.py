import json
from backend.api import app


def test_get_rooms():
    tester = app.test_client()
    response = tester.get("/rooms?id=24")
    print(response)
    assert response.status_code == 200


def test_create_room():
    tester = app.test_client()
    response = tester.post(
        "/rooms",
        data=json.dumps({"number": "101", "equipment": "Projector", "capacity": 20}),
        content_type="application/json",
    )
    assert response.status_code == 201


def test_update_room():
    tester = app.test_client()

    # First, create a room to update it later
    response_create = tester.post(
        "/rooms",
        data=json.dumps({"number": "102", "equipment": "Whiteboard", "capacity": 25}),
        content_type="application/json",
    )
    room_id = response_create.get_json().get("id")  # Get the room ID from the response

    # Now, update the created room (assumes room_id is valid and exists)
    updated_data = {
        "id": 4,
        "number": "103",  # Update room number
        "equipment": "Projector, Whiteboard",  # Update equipment
        "capacity": 30,  # Update capacity
    }

    response_update = tester.put(
        "/rooms", data=json.dumps(updated_data), content_type="application/json"
    )
    print(response_update.data)
    assert response_update.status_code == 200  # Ensure it was updated successfully

    # Optionally, check the response message
    assert response_update.get_json()["message"] == "Room updated successfully."


def test_delete_room():
    tester = app.test_client()

    # First, create a room to delete it later
    response_create = tester.post(
        "/rooms",
        data=json.dumps({"number": "104", "equipment": "TV", "capacity": 15}),
        content_type="application/json",
    )
    room_id = response_create.get_json().get("id")  # Get the room ID from the response

    # Now, delete the created room (assumes room_id is valid and exists)
    response_delete = tester.delete(
        "/rooms", data=json.dumps({"id": 4}), content_type="application/json"
    )
    assert (
        response_delete.status_code == 200
    )  # Ensure the room was deleted successfully

    # Optionally, check the response message
    assert response_delete.get_json()["message"] == "Room deleted successfully."


def test_create_reservation():
    tester = app.test_client()
    response = tester.post(
        "/reservations",
        data=json.dumps(
            {
                "fk_user": 1,  # Assuming user with ID 1 exists
                "fk_room": 1,  # Assuming room with ID 1 exists
                "start_date": "2025-01-24T10:00:00",
                "end_date": "2025-01-24T12:00:00",
            }
        ),
        content_type="application/json",
    )
    print(response.data)  # Print the response body to debug
    assert (
        response.status_code == 201
    )  # Ensure the reservation was created successfully


def test_get_reservations():
    tester = app.test_client()
    response = tester.get("/reservations")
    print(response.data)  # Print the response body to debug
    assert (
        response.status_code == 200
    )  # Ensure the reservations are retrieved successfully


def test_update_reservation():
    tester = app.test_client()
    response = tester.put(
        "/reservations",
        data=json.dumps(
            {
                "id": 1,  # Assuming reservation with ID 1 exists
                "fk_user": 1,  # Update the user ID if necessary
                "fk_room": 2,  # Assuming room with ID 2 exists
                "start_date": "2025-01-24T13:00:00",
                "end_date": "2025-01-24T15:00:00",
                "is_realized": True,  # Update the status if needed
            }
        ),
        content_type="application/json",
    )
    print(response.data)  # Print the response body to debug
    assert (
        response.status_code == 200
    )  # Ensure the reservation was updated successfully


def test_delete_reservation():
    tester = app.test_client()
    response_delete = tester.delete(
        "/reservations",
        data=json.dumps({"id": 1}),  # Assuming reservation with ID 1 exists
        content_type="application/json",
    )
    print(response_delete.data)  # Print the response body to debug
    assert (
        response_delete.status_code == 200
    )  # Ensure the reservation was deleted successfully


if __name__ == "__main__":
    test_create_reservation()
    test_get_reservations()
    test_update_reservation()
    test_delete_reservation()
    test_get_rooms()
