
###############################################################################
########                TO JEST NA PC                               ###########
###############################################################################

from sqlite3.dbapi2 import Timestamp
import paho.mqtt.client as mqtt
import sqlite3
import time
from database_operations import handle_card_read

TOPIC = "worker/card"
BROKER = "10.108.33.125"

client = mqtt.Client()

def process_message(client, userdata, message):
    message_decoded = (str(message.payload.decode("utf-8")))
    msg_text, msg_time , room_id = message_decoded.split(" - ")

    if msg_text != "podlaczano klienta:" and msg_text != "klient rozlaczony":
        print(f"{time.ctime()} : {msg_text} used the RFID card.")
        handle_card_read(msg_text, msg_time, room_id)
    else:
        print(message_decoded)


def connect_to_broker():
    client.connect(BROKER)
    print("Connected to broker.")
    client.on_message = process_message
    client.loop_start()
    client.subscribe(TOPIC)
    print(f"Subscribed to {TOPIC}")

def disconnect_from_broker():
    client.loop_stop()
    client.disconnect()
    print("Disconnected.")

def run_receiver():
    connect_to_broker()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        pass

    disconnect_from_broker()


if __name__ == "__main__":
    run_receiver()
