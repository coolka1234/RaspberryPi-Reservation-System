from datetime import timedelta
from math import e
from sqlalchemy import Boolean, ForeignKey, MetaData, create_engine, Table, Integer, Column, String, DateTime 
metadata=MetaData()
engine=create_engine('sqlite:///database.db', echo=True)
table_reservation=Table('Reservation',metadata,
    Column('id',Integer,primary_key=True),
    Column('fk_user',Integer, ForeignKey('User.id')),
    Column('fk_room',Integer, ForeignKey('Room.id')),
    Column('start_date',DateTime),
    Column('end_date',DateTime),
    Column('is_realized',Boolean, default=False, nullable=False),
    Column('is_finalized',Boolean, default=False, nullable=False),
)

table_room=Table('Room',metadata,
    Column('id',Integer,primary_key=True),
    Column('number',String),
    Column('equipment',String),
    Column('capacity',Integer),
    Column('is_active',Boolean),
)

table_user=Table('User',metadata,
    Column('id',Integer,primary_key=True),
    Column('login',String),
    Column('password',String),
    Column('name',String),
    Column('surname',String),
    Column('uid',String),
)


def create_database():
    """Swtórz bazę danych"""
    metadata.create_all(engine)

def drop_database():
    """Usuń bazę danych"""
    metadata.drop_all(engine)

def get_user_by_uid(uid):
    """Pobierz użytkownika po UID"""
    connection=engine.connect()
    result=connection.execute(table_user.select().where(table_user.c.uid==uid)).fetchone()
    connection.close()
    return result

def get_room_by_number(room_number):
    """Pobierz pokój po ID"""
    connection=engine.connect()
    result=connection.execute(table_room.select().where(table_room.c.number==room_number)).fetchone()
    connection.close()
    return result

def find_reservation(room_id, user_id, read_time):
    """Znajdź rezerwację dla użytkownika i pokoju"""
    connection=engine.connect()
    result=connection.execute(table_reservation.select().where(table_reservation.c.fk_user==user_id).where(table_reservation.c.fk_room==room_id).where(table_reservation.c.start_date<=read_time).where(table_reservation.c.end_date>=read_time)).fetchone()
    connection.close()
    return result

def handle_card_read(card_id, read_time, room_id):
    """Obsłuż odczyt karty, utwórz rezerwację na podstawie odczytu"""
    connection=engine.connect()
    user=get_user_by_uid(card_id)
    if user is None:
        print(f"User with card id {card_id} not found.")
        connection.close()
        return False
    room=get_room_by_number(room_id)
    if room is None:
        print(f"Room with id {room_id} not found.")
        connection.close()
        return False
    reservation=find_reservation(room_id, user.id, read_time)
    if reservation is None:
        print(f"Reservation not found for user {user.id} and room {room_id}.")
        connection.close()
        return False
    else:
        if reservation.is_finalized:
            print(f"Reservation for user {user.id} and room {room_id} is already finalized.")
            connection.close()
            return False
        elif reservation.is_realized:
            print(f"Reservation for user {user.id} and room {room_id} is realized. Finalizing it.")
            connection.execute(table_reservation.update().where(table_reservation.c.id==reservation.id).values(is_finalized=True))
            connection.close()
            return True
        else:
            print(f"Reservation for user {user.id} and room {room_id} found. Realizing it.")
            connection.execute(table_reservation.update().where(table_reservation.c.id==reservation.id).values(is_realized=True))
            connection.commit()
            connection.close()
            return True

def create_reservation(fk_user, fk_room, start_date, end_date):
    """Utwórz rezerwację"""
    connection=engine.connect()
    connection.execute(table_reservation.insert().values(fk_user=fk_user, fk_room=fk_room, start_date=start_date, end_date=end_date))
    connection.commit()
    connection.close()

def get_reservations():
    """Pobierz wszystkie rezerwacje"""
    connection=engine.connect()
    result=connection.execute(table_reservation.select()).fetchall()
    connection.close()
    return result

def get_rooms():
    """Pobierz wszystkie pokoje"""
    connection=engine.connect()
    result=connection.execute(table_room.select()).fetchall()
    connection.close()
    return result

def create_user(login, password, name, surname, uid):
    """Utwórz użytkownika"""
    connection=engine.connect()
    connection.execute(table_user.insert().values(login=login, password=password, name=name, surname=surname, uid=uid))
    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_user("user", "user", "user", "user", 928285915686)
    print("User created")
                       
