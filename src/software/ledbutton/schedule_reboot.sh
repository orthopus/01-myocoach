#!/bin/bash

FILE="/srv/ledbutton/led_color.txt"

echo "255 255 0 1" > $FILE
sleep 10;
reboot;
