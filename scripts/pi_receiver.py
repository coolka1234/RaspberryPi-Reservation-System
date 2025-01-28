###############################################################################
########                TO JEST NA PI(receiver)                     ###########
###############################################################################

from sqlite3.dbapi2 import Timestamp
from unittest import result
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
from config import *  # pylint: disable=unused-wildcard-import
from mfrc522 import MFRC522
import time
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from database_operations import handle_card_read
from pc_sender import notify_worker
import socket
ip=socket.gethostbyname(socket.gethostname())


TOPIC = "worker/results"
BROKER = str(ip) #zobaczymy czy działa
CONNECT_MESSAGE = "Client connected:"
DISCONNECT_MESSAGE = "Client disconnected:"

client = mqtt.Client()

def set_buzzer_state(state):
    GPIO.output(buzzerPin, not state)

def activate_buzzer():
    set_buzzer_state(True)
    time.sleep(1)
    set_buzzer_state(False)

def blink_led():
    GPIO.output(led1, GPIO.HIGH)
    time.sleep(1)
    GPIO.output(led1, GPIO.LOW)
    time.sleep(1)

def process_message(client, userdata, message):
    message_decoded = (str(message.payload.decode("utf-8")))
    result, message_time = message_decoded.split(" - ")
    if result == "True":
        print(f"Worker received the message at {message_time}.")
        activate_buzzer()
        blink_led()
    else:
        print(f"Wrong result received at {message_time}.")
        activate_buzzer()
        activate_buzzer()
        activate_buzzer()




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