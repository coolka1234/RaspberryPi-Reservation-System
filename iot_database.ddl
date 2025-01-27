CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    uid TEXT NOT NULL UNIQUE
);

CREATE TABLE Room (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL UNIQUE,
    equipment TEXT,
    capacity INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE Reservation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_user INTEGER,
    fk_room INTEGER,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_realized BOOLEAN NOT NULL DEFAULT 0,
    is_finalized BOOLEAN NOT NOT DEFAULT 0,
    FOREIGN KEY (fk_user) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (fk_room) REFERENCES Room(id) ON DELETE SET NULL
);