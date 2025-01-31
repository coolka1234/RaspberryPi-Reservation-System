# pylint: disable=no-member

###############################################################################
########     TO JEST NA PC(sender statusu wyniku odczytu karty)     ###########
###############################################################################

import time
# from config import *  # pylint: disable=unused-wildcard-import
from datetime import datetime
# disable warning
import paho.mqtt.client as mqtt
import tkinter

CONNECT_MESSAGE = "Client connected:"
DISCONNECT_MESSAGE = "Client disconnected:"


default_terminal_id = "T0"
default_broker = "10.108.33.125"
mqtt_client = mqtt.Client()



def notify_worker(result, scan_time):
    # na Windowsie moze byc kompletnie inaczej - nwm
    mqtt_client.publish("worker/results",f"{result} - {scan_time}")

def disconnect_from_mqtt_broker():
    notify_worker(DISCONNECT_MESSAGE, datetime.now())
    mqtt_client.disconnect()

def connect_to_mqtt_broker():
    mqtt_client.connect(default_broker)
    notify_worker(CONNECT_MESSAGE, datetime.now())


def main():
    connect_to_mqtt_broker()

if __name__ == "__main__":

    main()