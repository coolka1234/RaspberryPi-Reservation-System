from sqlalchemy import Boolean, MetaData, create_engine, Table, Integer, Column, String, TIMESTAMP 
metadata=MetaData()
engine=create_engine('sqlite:///database.db', echo=True)
table_card_reads=Table('card_reads',metadata,
    Column('id',Integer,primary_key=True),
    Column('time',TIMESTAMP),
    Column('card_id',String),
)

table_conference_rooms=Table('conference_rooms',metadata,
    Column('id',Integer,primary_key=True),
    Column('name',String),
    Column('capacity',Integer),
    Column('projector',Boolean),
)

def create_database():
    """Swtórz bazę danych"""
    metadata.create_all(engine)

def drop_database():
    """Usuń bazę danych"""
    metadata.drop_all(engine)

def get_all_card_reads():
    """Pobierz wszystkie odczyty kart"""
    conn=engine.connect()
    query=table_card_reads.select()
    result=conn.execute(query)
    return result.fetchall()

def get_card_read(id):
    """Pobierz odczyt karty o podanym id"""
    conn=engine.connect()
    query=table_card_reads.select().where(table_card_reads.c.id==id)
    result=conn.execute(query)
    return result.fetchone()

def get_all_conference_rooms():
    """Wszystie sale konferencyjne"""
    conn=engine.connect()
    query=table_conference_rooms.select()
    result=conn.execute(query)
    return result.fetchall()

def get_conference_room(id):
    """Sala konferencyjna o podanym id"""
    conn=engine.connect()
    query=table_conference_rooms.select().where(table_conference_rooms.c.id==id)
    result=conn.execute(query)
    return result.fetchone()

def insert_card_read(time,card_id):
    """Wstaw odczyt karty"""
    conn=engine.connect()
    query=table_card_reads.insert().values(time=time,card_id=card_id)
    conn.execute(query)

def delete_card_read(id):
    """Usuń odczyt karty o podanym id"""
    conn=engine.connect()
    query=table_card_reads.delete().where(table_card_reads.c.id==id)
    conn.execute(query)

if __name__ == "__main__":
    create_database()
    print("Database created.")
                       
