from datetime import datetime, timedelta
from sqlalchemy import (
    Boolean,
    ForeignKey,
    MetaData,
    create_engine,
    Table,
    Integer,
    Column,
    String,
    DateTime,
    exc,
    select,
    sql,
)

date_format = "%Y-%m-%d %H:%M"

metadata = MetaData()
engine = create_engine("sqlite:///database.db", echo=True)
table_reservation = Table(
    "Reservation",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("fk_user", Integer, ForeignKey("User.id")),
    Column("fk_room", Integer, ForeignKey("Room.id")),
    Column("start_date", DateTime),
    Column("end_date", DateTime),
    Column("is_realized", Boolean, default=False, nullable=False),
    Column("is_finalized", Boolean, default=False, nullable=False),
)

table_room = Table(
    "Room",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("number", String),
    Column("equipment", String),
    Column("capacity", Integer),
    Column("is_active", Boolean),
)

table_user = Table(
    "User",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("login", String),
    Column("password", String),
    Column("name", String),
    Column("surname", String),
    Column("role", String),
    Column("uid", String),
)


def create_database():
    """Swtórz bazę danych"""
    metadata.create_all(engine)


def drop_database():
    """Usuń bazę danych"""
    metadata.drop_all(engine)


def handle_card_read(card_id, read_time, room_id):
    """Obsłuż odczyt karty, utwórz rezerwację na podstawie odczytu"""
    connection = engine.connect()
    user = get_user_by_uid(card_id)
    if user is None:
        print(f"User with card id {card_id} not found.")
        connection.close()
        return False
    room = get_room_by_number(room_id)
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
        if reservation.is_finalized:
            print(
                f"Reservation for user {user.id} and room {room_id} is already finalized."
            )
            connection.close()
            return False
        elif reservation.is_realized:
            print(
                f"Reservation for user {user.id} and room {room_id} is realized. Finalizing it."
            )
            connection.execute(
                table_reservation.update()
                .where(table_reservation.c.id == reservation.id)
                .values(is_finalized=True)
            )
            connection.close()
            return True
        else:
            print(
                f"Reservation for user {user.id} and room {room_id} found. Realizing it."
            )
            connection.execute(
                table_reservation.update()
                .where(table_reservation.c.id == reservation.id)
                .values(is_realized=True)
            )
            connection.commit()
            connection.close()
            return True


# USERS
def get_user_by_uid(uid):
    """Pobierz użytkownika po UID"""

    connection = engine.connect()
    result = connection.execute(
        table_user.select().where(table_user.c.uid == uid)
    ).fetchone()
    connection.close()
    return result


def log_in(login, password):
    connection = engine.connect()
    result = connection.execute(
        table_user.select().where(
            table_user.c.login == login, table_user.c.password == password
        )
    ).fetchone()
    connection.close()
    return result


def create_user(login, password, name, surname, uid, role="user"):
    """Utwórz użytkownika"""

    connection = engine.connect()
    connection.execute(
        table_user.insert().values(
            login=login,
            password=password,
            name=name,
            surname=surname,
            role=role,
            uid=uid,
        )
    )
    connection.commit()
    connection.close()


# ROOMS
def get_rooms():
    """Pobierz wszystkie pokoje"""

    connection = engine.connect()

    formatted_start_date = sql.func.strftime(
        date_format, table_reservation.c.start_date
    ).label("start_date")
    formatted_end_date = sql.func.strftime(
        date_format, table_reservation.c.end_date
    ).label("end_date")

    reservation_json = sql.func.json_object(
        "start_date",
        formatted_start_date,
        "end_date",
        formatted_end_date,
        "is_realized",
        table_reservation.c.is_realized,
        "is_finalized",
        table_reservation.c.is_finalized,
        "name",
        table_user.c.name,
        "surname",
        table_user.c.surname,
    )

    result = connection.execute(
        select(
            table_room.c.id,
            table_room.c.number,
            table_room.c.equipment,
            table_room.c.capacity,
            table_room.c.is_active,
            sql.func.json_group_array(
                sql.case(
                    (table_reservation.c.start_date.isnot(None), reservation_json),
                    else_=None,
                )
            ).label("reservations"),
        )
        .select_from(
            table_room.outerjoin(
                table_reservation,
                sql.and_(
                    table_room.c.id == table_reservation.c.fk_room,
                    sql.or_(
                        table_reservation.c.end_date > datetime.now(),
                        sql.and_(
                            table_reservation.c.is_realized == 1,
                            table_reservation.c.is_finalized == 0,
                        ),
                    ),
                ),
            ).outerjoin(table_user, table_reservation.c.fk_user == table_user.c.id)
        )
        .group_by(table_room.c.id)
    ).fetchall()
    connection.close()
    return result


def get_room_by_id(room_id):
    """Pobierz pokój po ID"""

    connection = engine.connect()
    result = connection.execute(
        table_room.select().where(table_room.c.id == room_id)
    ).fetchone()
    connection.close()
    return result


def get_room_by_number(room_number):
    """Pobierz pokój po ID"""

    connection = engine.connect()
    result = connection.execute(
        table_room.select().where(table_room.c.number == room_number)
    ).fetchone()
    connection.close()
    return result


def create_room(number, equipment, capacity):
    """Utwórz pokój"""

    connection = engine.connect()
    connection.execute(
        table_room.insert().values(
            number=number, equipment=equipment, capacity=capacity, is_active=True
        )
    )
    connection.commit()
    connection.close()


def update_room(room_id, number=None, equipment=None, capacity=None, is_active=None):
    """Zaktualizuj dane pokoju"""

    connection = engine.connect()

    updates = {}

    if number is not None:
        updates["number"] = number
    if equipment is not None:
        updates["equipment"] = equipment
    if capacity is not None:
        updates["capacity"] = capacity
    if is_active is not None:
        updates["is_active"] = is_active

    if not updates:
        print("Brak pól do aktualizacji")
        return

    try:
        connection.execute(
            table_room.update().where(table_room.c.id == room_id).values(**updates)
        )
        connection.commit()
        return {"message": "Room updated successfully."}, 200
    except exc.SQLAlchemyError as e:
        connection.rollback()
        return {"error": str(e)}, 500
    finally:
        connection.close()


def delete_room(room_id):
    """Usuń pokój"""

    connection = engine.connect()
    try:
        result = connection.execute(
            table_room.delete().where(table_room.c.id == room_id)
        )

        if result.rowcount == 0:
            return {"error": "Room not found."}, 404

        connection.commit()
        return {"message": "Room deleted successfully."}, 200
    except exc.SQLAlchemyError as e:
        connection.rollback()
        return {"error": str(e)}, 500
    finally:
        connection.close()


# RESERVATIONS
def get_reservations():
    """Pobierz wszystkie rezerwacje"""

    connection = engine.connect()
    result = connection.execute(table_reservation.select()).fetchall()
    connection.close()
    return result


def find_archived_reservations_for_room(room_id):
    connection = engine.connect()

    formatted_start_date = sql.func.strftime(
        date_format, table_reservation.c.start_date
    ).label("start_date")
    formatted_end_date = sql.func.strftime(
        date_format, table_reservation.c.end_date
    ).label("end_date")

    result = connection.execute(
        select(
            table_reservation.c.id,
            table_reservation.c.fk_room,
            table_reservation.c.fk_user,
            formatted_start_date.label("start_date"),
            formatted_end_date.label("end_date"),
            table_reservation.c.is_realized,
            table_reservation.c.is_finalized,
            table_user.c.name,
            table_user.c.surname,
        )
        .select_from(
            table_reservation.outerjoin(
                table_user, table_reservation.c.fk_user == table_user.c.id
            )
        )
        .where(
            sql.and_(
                table_reservation.c.fk_room == room_id,
                table_reservation.c.end_date < datetime.now(),
            )
        )
        .order_by(table_reservation.c.start_date, table_reservation.c.end_date)
    ).fetchall()

    connection.close()
    return result


def find_reservations_by_user(user_id):
    connection = engine.connect()

    formatted_start_date = sql.func.strftime(
        date_format, table_reservation.c.start_date
    ).label("start_date")
    formatted_end_date = sql.func.strftime(
        date_format, table_reservation.c.end_date
    ).label("end_date")

    result = connection.execute(
        select(
            table_reservation.c.id,
            formatted_start_date,
            formatted_end_date,
            table_room.c.number,
        )
        .select_from(
            table_reservation.outerjoin(
                table_room, table_reservation.c.fk_room == table_room.c.id
            )
        )
        .where(
            table_reservation.c.fk_user == user_id,
            table_reservation.c.end_date > datetime.now(),
            table_reservation.c.is_realized != 1,
        )
        .order_by(table_reservation.c.start_date)
    ).fetchall()
    connection.close()
    return result


def find_reservation(room_id, user_id, read_time):
    """Znajdź rezerwację dla użytkownika i pokoju"""

    connection = engine.connect()
    result = connection.execute(
        table_reservation.select()
        .where(table_reservation.c.fk_user == user_id)
        .where(table_reservation.c.fk_room == room_id)
        .where(table_reservation.c.start_date <= read_time)
        .where(table_reservation.c.end_date >= read_time)
    ).fetchone()
    connection.close()
    return result


def create_reservation(
    fk_user, fk_room, start_date, end_date, is_realized=0, is_finalized=0
):
    """Utwórz rezerwację"""

    connection = engine.connect()
    connection.execute(
        table_reservation.insert().values(
            fk_user=fk_user,
            fk_room=fk_room,
            start_date=start_date,
            end_date=end_date,
            is_realized=is_realized,
            is_finalized=is_finalized,
        )
    )
    connection.commit()
    connection.close()


def update_reservation(
    reservation_id,
    fk_user=None,
    fk_room=None,
    start_date=None,
    end_date=None,
    is_realized=None,
):
    """Zaktualizuj dane rezerwacji"""

    connection = engine.connect()
    update_values = {}
    if fk_user is not None:
        update_values["fk_user"] = fk_user
    if fk_room is not None:
        update_values["fk_room"] = fk_room
    if start_date is not None:
        update_values["start_date"] = start_date
    if end_date is not None:
        update_values["end_date"] = end_date
    if is_realized is not None:
        update_values["is_realized"] = is_realized

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

    except exc.SQLAlchemyError as e:
        connection.rollback()  # Rollback in case of error
        return {"error": str(e)}, 500

    finally:
        connection.close()  # Ensure connection is closed


def delete_reservation(reservation_id):
    """Usuń rezerwację"""

    connection = engine.connect()
    connection.execute(
        table_reservation.delete().where(table_reservation.c.id == reservation_id)
    )
    connection.commit()
    connection.close()


if __name__ == "__main__":
    drop_database()
    create_database()
    create_user("user@a.pl", "user", "Jan", "Kowalski", 928285915686)
    create_user("admin@a.pl", "admin", "Janina", "Nowak", 111222, role="admin")
    create_room(1, "podgrzewane fotele", 20)
    create_room(2, "ekspres do kawy", 5)
    create_room(3, "rzutnik, drukarka", 3)

    # TAKEN
    create_reservation(
        1,
        2,
        datetime.now() - timedelta(hours=1),
        datetime.now() + timedelta(hours=2),
        1,
    )

    # OVERTIME
    create_reservation(
        1,
        1,
        datetime.now() - timedelta(hours=2),
        datetime.now() - timedelta(hours=1),
        1,
    )

    create_reservation(
        1,
        1,
        datetime.now() + timedelta(days=1),
        datetime.now() + timedelta(days=1, hours=2),
    )
    create_reservation(
        1,
        1,
        datetime.now() + timedelta(days=2),
        datetime.now() + timedelta(days=2, hours=2),
    )
    create_reservation(
        1,
        2,
        datetime.now() - timedelta(days=10),
        datetime.now() - timedelta(days=10) + timedelta(hours=3),
    )
