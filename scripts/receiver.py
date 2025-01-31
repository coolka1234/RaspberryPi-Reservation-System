###############################################################################
########                TO JEST NA PC                               ###########
###############################################################################

from sqlite3.dbapi2 import Timestamp
import paho.mqtt.client as mqtt
import time
import sys
import os
import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from backend.database_operations import handle_card_read
from pc_sender import notify_worker, main

TOPIC = "worker/card"
BROKER = "10.108.33.125"

client = mqtt.Client()


def process_message(client, userdata, message):
    message_decoded = str(message.payload.decode("utf-8"))
    msg_text, msg_time, room_id = message_decoded.split(" - ")

    if msg_text != "podlaczano klienta:" and msg_text != "klient rozlaczony":
        print(f"{time.ctime()} : {msg_text} used the RFID card.")
        result=handle_card_read(msg_text, msg_time, room_id)
        print(msg_time)

        notify_worker(result, datetime.datetime.now())
    else:
        print(message_decoded)


def connect_to_broker():
    client.connect(BROKER)
    print("Connected to broker.")
    main()
    print("Connected to main")
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
