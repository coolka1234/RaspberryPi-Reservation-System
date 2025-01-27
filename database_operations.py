from datetime import timedelta
from math import e
from sqlalchemy import Boolean, ForeignKey, MetaData, create_engine, Table, Integer, Column, String, DateTime, table
from datetime import datetime
metadata = MetaData()
engine = create_engine('sqlite:///database.db', echo=True)

table_reservation = Table('Reservation', metadata,
    Column('id', Integer, primary_key=True),
    Column('fk_user', Integer, ForeignKey('User.id')),
    Column('fk_room', Integer, ForeignKey('Room.id')),
    Column('start_date', DateTime),
    Column('end_date', DateTime),
    Column('is_realized', Boolean, default=False, nullable=False),
    Column('is_finalized', Boolean, default=False, nullable=False),
)

table_room = Table('Room', metadata,
    Column('id', Integer, primary_key=True),
    Column('number', String),
    Column('equipment', String),
    Column('capacity', Integer),
    Column('is_active', Boolean),
)

table_user = Table('User', metadata,
    Column('id', Integer, primary_key=True),
    Column('login', String),
    Column('password', String),
    Column('name', String),
    Column('surname', String),
    Column('uid', String),
)

def create_database():
    """Swtórz bazę danych"""
    metadata.create_all(engine)

def drop_database():
    """Usuń bazę danych"""
    metadata.drop_all(engine)

def get_user_by_uid(uid):
    """Pobierz użytkownika po UID"""
    connection = engine.connect()
    result = connection.execute(table_user.select().where(table_user.c.uid == uid)).fetchone()
    connection.close()
    

def get_room_by_id(room_id):
    """Retrieve a room by its ID."""
    connection = engine.connect()
    try:
        result = connection.execute(table_room.select().where(table_room.c.id == room_id)).fetchone()
        if result is None:
            return {"error": "Room not found"}, 404 
        columns = [column.name for column in table_room.columns]
        room = dict(zip(columns, result))
        return room
    finally:
        connection.close()



def find_reservation(room_id, user_id, read_time):
    """Znajdź rezerwację dla użytkownika i pokoju"""
    connection = engine.connect()
    result = connection.execute(table_reservation.select()
                                 .where(table_reservation.c.fk_user == user_id)
                                 .where(table_reservation.c.fk_room == room_id)
                                 .where(table_reservation.c.start_date <= read_time)
                                 .where(table_reservation.c.end_date >= read_time)).fetchone()
    connection.close()
    return result

def handle_card_read(card_id, read_time, room_id):
    """Obsłuż odczyt karty, utwórz rezerwację na podstawie odczytu"""
    connection = engine.connect()
    user = get_user_by_uid(card_id)
    if user is None:
        print(f"User with card id {card_id} not found.")
        connection.close()
        return False
    room = get_room_by_id(room_id)
    if room is None:
        print(f"Room with id {room_id} not found.")
        connection.close()
        return False
    reservation = find_reservation(room_id, user.id, read_time)
    if reservation is None:
        print(f"Reservation not found for user {user.id} and room {room_id}.")
        connection.close()
        return False
    else:
        connection.execute(table_reservation.update()
                           .where(table_reservation.c.id == reservation.id)
                           .values(is_realized=True))
        connection.commit()
        connection.close()
        return True

def create_reservation(fk_user, fk_room, start_date, end_date):
    """Utwórz rezerwację"""
    connection = engine.connect()
    start_date = datetime.fromisoformat(start_date)
    end_date = datetime.fromisoformat(end_date)
    connection.execute(table_reservation.insert()
                       .values(fk_user=fk_user, fk_room=fk_room, start_date=start_date, end_date=end_date))
    connection.commit()
    connection.close()

def create_room(number, equipment, capacity):
    """Utwórz pokój"""
    connection = engine.connect()
    connection.execute(table_room.insert()
                       .values(number=number, equipment=equipment, capacity=capacity, is_active=True))
    connection.commit()
    connection.close()

def get_reservations():
    """Pobierz wszystkie rezerwacje"""
    connection = engine.connect()
    result = connection.execute(table_reservation.select()).fetchall()
    connection.close()
    columns = [column.name for column in table_room.columns] 
    reservations = [dict(zip(columns, row)) for row in result]
    return reservations

def get_rooms():
    """Pobierz wszystkie pokoje"""
    connection=engine.connect()
    result=connection.execute(table_room.select()).fetchall()
    print(type(result))  # Check what type result is
    print(result)     
    connection.close()
    columns = [column.name for column in table_room.columns] 
    rooms = [dict(zip(columns, row)) for row in result]
    return rooms

def create_user(login, password, name, surname, uid):
    """Utwórz użytkownika"""
    connection = engine.connect()
    connection.execute(table_user.insert()
                       .values(login=login, password=password, name=name, surname=surname, uid=uid))
    connection.commit()
    connection.close()

from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

# Set up the session maker (typically done at the start of the app)
Session = sessionmaker(bind=engine)

def delete_room(room_id):
    """Usuń pokój"""
    connection = engine.connect()
    try:
        # Execute the delete query
        result = connection.execute(table_room.delete().where(table_room.c.id == room_id))
        
        if result.rowcount == 0:
            # If no rows were deleted, the room doesn't exist
            return {"error": "Room not found."}, 404
        
        connection.commit()  # Commit the deletion
        return {"message": "Room deleted successfully."}, 200

    except SQLAlchemyError as e:
        connection.rollback()  # Rollback in case of error
        return {"error": str(e)}, 500

    finally:
        connection.close()  # Ensure connection is closed

def delete_reservation(reservation_id):
    """Usuń rezerwację"""
    connection = engine.connect()
    connection.execute(table_reservation.delete().where(table_reservation.c.id == reservation_id))
    connection.commit()
    connection.close()
def update_room(room_id, number=None, equipment=None, capacity=None, is_active=None):
    """Zaktualizuj dane pokoju"""
    connection = engine.connect()

    updates = {}

    if number is not None:
        updates['number'] = number
    if equipment is not None:
        updates['equipment'] = equipment
    if capacity is not None:
        updates['capacity'] = capacity
    if is_active is not None:
        updates['is_active'] = is_active

    if not updates:
        print("Brak pól do aktualizacji")
        return

    try:
        # Update the room with the specified values
        connection.execute(
            table_room.update()
            .where(table_room.c.id == room_id)
            .values(**updates)
        )
        connection.commit()  # Commit the changes
        return {"message": "Room updated successfully."}, 200

    except SQLAlchemyError as e:
        connection.rollback()  # Rollback in case of error
        return {"error": str(e)}, 500

    finally:
        connection.close()  # Ensure connection is closed


def update_reservation(reservation_id, fk_user=None, fk_room=None, start_date=None, end_date=None, is_realized=None, is_finalized=None):
    """Zaktualizuj dane rezerwacji"""
    connection = engine.connect()
    update_values = {}
    if fk_user is not None:
        update_values['fk_user'] = fk_user
    if fk_room is not None:
        update_values['fk_room'] = fk_room
    if start_date is not None:
        update_values['start_date'] = start_date
    if end_date is not None:
        update_values['end_date'] = end_date
    if is_realized is not None:
        update_values['is_realized'] = is_realized
    if is_finalized is not None:
        update_values['is_finalized'] = is_finalized
    if not update_values:
        print("Brak pól do aktualizacji")
        return
    try:
        # Update the room with the specified values
        connection.execute(
            table_reservation.update()
            .where(table_reservation.c.id == reservation_id)
            .values(**update_values)
        )
        connection.commit()  # Commit the changes
        return {"message": "Room updated successfully."}, 200

    except SQLAlchemyError as e:
        connection.rollback()  # Rollback in case of error
        return {"error": str(e)}, 500

    finally:
        connection.close()  # Ensure connection is closed

  
if __name__ == "__main__":
    create_database()
    print("Database created.")
