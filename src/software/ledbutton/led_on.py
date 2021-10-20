import RPi.GPIO as GPIO
import time
import sys
import signal
import math

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

sleepRef=100

argRed = float(sys.argv[1])
argGreen = float(sys.argv[2])
argBlue = float(sys.argv[3])

red = argRed/765
green = argGreen/765
blue = argBlue/765
black = 1 - (red + green + blue)
blink = int(sys.argv[4])

# GPIO 17, 27, 22 (BCM)
pins = [11,13,15]

GPIO.setup(pins, GPIO.OUT)

t = 1

def signal_term_handler(signal, frame):
    GPIO.output(pins, True)
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_term_handler)

while True:
    try:
        if red > 0:
            GPIO.output(pins[0], False)
            time.sleep(red/sleepRef)
            GPIO.output(pins[0], True)
        else:
            GPIO.output(pins[0], True)

        if green > 0:
            GPIO.output(pins[1], False)
            time.sleep(green/sleepRef)
            GPIO.output(pins[1], True)
        else:
            GPIO.output(pins[1], True)

        if blue > 0:
            GPIO.output(pins[2], False)
            time.sleep(blue/sleepRef)
            GPIO.output(pins[2], True)
        else:
            GPIO.output(pins[2], True)

	if black > 0:
            GPIO.output(pins, True)
            time.sleep(black/sleepRef)

        if blink == 1:
            GPIO.output(pins, True)
            ts = 1+(math.sin(t/(2*math.pi))/2)
            time.sleep(ts/sleepRef)
            t += 1

    except KeyboardInterrupt:
        GPIO.output(pins, True)
        sys.exit(0)
