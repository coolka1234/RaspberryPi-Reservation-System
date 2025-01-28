#!/usr/bin/env python3

# pylint: disable=no-member

###############################################################################
########                TO JEST NA RASPBERRY PI                     ###########
###############################################################################

import time
from tkinter.tix import DirTree
import RPi.GPIO as GPIO
from config import *  # pylint: disable=unused-wildcard-import
from mfrc522 import MFRC522
from datetime import datetime
# disable warning
import paho.mqtt.client as mqtt
import tkinter

CONNECT_MESSAGE = "Client connected:"
DISCONNECT_MESSAGE = "Client disconnected:"

is_executing = True

default_terminal_id = "T0"
default_broker = "localhost"
ROOM_ID="10.108.33.125"
mqtt_client = mqtt.Client()

def handle_button_press(channel):
    global is_executing
    is_executing = False

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

def read_rfid():
    global is_executing
    rfid_reader = MFRC522()
    last_scan_time = datetime.timestamp(datetime.now()) - 3
    while is_executing:
        if datetime.timestamp(datetime.now()) - last_scan_time > 3.0:
            status, _ = rfid_reader.MFRC522_Request(rfid_reader.PICC_REQIDL)
            if status == rfid_reader.MI_OK:
                status, uid = rfid_reader.MFRC522_Anticoll()
                if status == rfid_reader.MI_OK:
                    scan_time = datetime.now()
                    card_uid = sum(uid[i] << (i * 8) for i in range(len(uid)))
                    print(f"Card UID: {card_uid}")
                    print(f"Date and time: {scan_time}")
                    print(f"Room ID: {default_terminal_id}")
                    # jedyna zmiana - może ułatwi insercję do bazy
                    notify_worker(card_uid, datetime.timestamp(scan_time), ROOM_ID)
                    activate_buzzer()
                    blink_led()
                    last_scan_time = datetime.timestamp(datetime.now())


def notify_worker(worker_id, scan_time, room_id):
    mqtt_client.publish("worker/card", f"{worker_id} - {scan_time} - {room_id}")

def disconnect_from_mqtt_broker():
    notify_worker(DISCONNECT_MESSAGE, datetime.now())
    mqtt_client.disconnect()

def connect_to_mqtt_broker():
    mqtt_client.connect(default_broker)
    notify_worker(CONNECT_MESSAGE, datetime.now())


def main():
    # GPIO.add_event_detect(buttonRed, GPIO.FALLING, callback=handle_button_press, bouncetime=200)
    print('Przyloz karte.')
    connect_to_mqtt_broker()
    read_rfid()
    disconnect_from_mqtt_broker()

if __name__ == "__main__":
    main()
    GPIO.cleanup()