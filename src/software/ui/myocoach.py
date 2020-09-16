#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    MyoCoach GUI
    ============

    This class MyoCoach is the Main GUI of the software.

     - Create Menu and Status Bar
     - Arduino management (search, connection, communication)
     - Charge and dischare widget like signal and games

    Author: David Gouaillier
    Website: orthopus.com
    Last edited: March 2019
"""

import sys
import serial
from serial.tools.list_ports import comports
import webbrowser

from PyQt5 import QtWidgets
from PyQt5 import QtGui
from PyQt5 import QtCore

from Widget.Signal.Signal import Signal
from Widget.Game.FlappyBird.FlappyBird import FlappyBird

DEBUG = False

class MyoCoach(QtWidgets.QMainWindow, QtWidgets.QWidget):
    def __init__(self):
        super(MyoCoach, self).__init__()
        self.appName = "Myo Coach"
        self.version = "1.0"
        self.createMenu()
        self.createStatusBar()
        self.initUI()
        self.initTimer()

    def createMenu(self):
        """ function to create Menu and SubMenu of the GUI"""
        mainMenu = self.menuBar()
        mainMenu.setNativeMenuBar(False) # For macOs

        # Menu to allow the user to connect to the Arduino Board
        connectMenu = mainMenu.addMenu('Connection')
        # The QAction Name will be fill with the name of the arduino
        # Board and Port by the function searchArduino()
        self.arduinoAct = QtWidgets.QAction('', self)
        self.arduinoAct.triggered.connect(self.connectArduinoBoard)
        connectMenu.addAction(self.arduinoAct)

        # In the Widget Menu, the user could choose between a visualisation
        # of the raw signals of EMG or to play a game
        widgetMenu = mainMenu.addMenu('Widget')
        signalAct = QtWidgets.QAction('Signal', self)
        # The function widgetChoice define the Widget to show in relation to the
        # QAction Name
        signalAct.triggered.connect(lambda: self.widgetChoice(signalAct.text()))
        gameMenu  = QtWidgets.QMenu('Game', self)
        # The Game subMenu with FlappyBird.
        # To Add a new Game, add a new QAction !
        flappyBirdAct = QtWidgets.QAction('FlappyBird', self)
        flappyBirdAct.triggered.connect(lambda: self.widgetChoice(flappyBirdAct.text()))
        gameMenu.addAction(flappyBirdAct)

        widgetMenu.addAction(signalAct)
        widgetMenu.addMenu(gameMenu)

        # The Help Menu give information about the software and
        # give a direct link to the Software documentation
        helpMenu = mainMenu.addMenu('Help')
        aboutAct = QtWidgets.QAction('About', self)
        aboutAct.triggered.connect(self.aboutMessage)
        helpMenu.addAction(aboutAct)
        documentationAct = QtWidgets.QAction('User Manual', self)
        documentationAct.triggered.connect(self.docLink)
        helpMenu.addAction(documentationAct)

    def widgetChoice(self, name):
        """ Function to laod Widget in relation to menu choice"""
        self.widget.deleteLater()
        if(name == "Signal"):
            self.widget = Signal(self)
        elif(name=="FlappyBird"):
            self.widget = FlappyBird(self)
        else:
            print("Bad Menu Name")
        self.mainLayout.addWidget(self.widget)
        self.widget.setFocus()

    def docLink(self):
        """ Open the software documentation in a webBrower"""
        webbrowser.open('https://github.com/orthopus/0113-myocoach-diy/blob/master/docs/user-manual.md')

    def aboutMessage(self):
        """ AQMessageBox with information about the software"""
        website = 'http://orthopus.com'
        email = 'contact@orthopus.com'
        license_link = 'https://creativecommons.org/publicdomain/zero/1.0/'
        license_name = '(CC0 1.0)'

        msgBox = QtWidgets.QMessageBox()
        msgBox.setWindowTitle('About ' + self.appName)
        msgBox.setIcon(QtWidgets.QMessageBox.Information)
        msgBox.setTextFormat( QtCore.Qt.RichText )
        msgBox.setIconPixmap( QtGui.QPixmap('assets/logo.png') )
        msgBox.setText( "<br><br><br>"
                       + self.appName + " v" + self.version + "<br>"
                       + "2020 Orthopus<br><br>"
                       + "<a href='{0}'>{0}</a><br><br>".format(website)
                       + "<a href='mailto:{0}'>{0}</a><br><br>".format(email)
                       + "License: <a href='{0}'>{1}</a>".format(license_link, license_name) )

        msgBox.setStandardButtons( QtWidgets.QMessageBox.Ok )
        msgBox.exec_()

    def createStatusBar(self):
        """Function to create a Status Bar with Arduino connection Statuts"""
        # The QLable usb_connection is here to show PNG image (QPixmap)
        # function connectArduinoBoard() fill the label with the good img
        self.label_usb_connection = QtWidgets.QLabel(self)
        self.pixmap_usb_ok = QtGui.QPixmap('assets/usb_ok.png')
        self.pixmap_usb_ko = QtGui.QPixmap('assets/usb_ko.png')
        # The QLable usb_name is here to show the arduino name
        # function connectArduinoBoard() fill the label with the good name
        self.label_usb_name = QtWidgets.QLabel(self)
        # Assign the two label to the Status Bar
        self.statusBar().addWidget(self.label_usb_connection)
        self.statusBar().addWidget(self.label_usb_name)

    def initUI(self):
        """
            Function to initialisze the Main Widget
            - Layout with 2 ProgressBar to show the EMG value
              This Layout is always visible
            - the
        """
        self.mainWidget = QtWidgets.QWidget()
        self.setCentralWidget(self.mainWidget)

        # Create the emg Layout with 2 Progress Bar
        emgLayout = QtWidgets.QHBoxLayout()
        # Vertical Bar to show the level of Channel O EMG
        self.progressBarEmg0 = QtWidgets.QProgressBar(self)
        self.progressBarEmg0.setOrientation(QtCore.Qt.Vertical)
        # Vertical Bar to show the level of Channel 1 EMG
        # Note : This Progress Bar is inverted
        self.progressBarEmg1 = QtWidgets.QProgressBar(self)
        self.progressBarEmg1.setOrientation(QtCore.Qt.Vertical)
        self.progressBarEmg1.setInvertedAppearance(True)
        # We create 10 Ticks to follow the signal
        tickLayout = QtWidgets.QVBoxLayout()
        newFont = QtGui.QFont("Times", 12, QtGui.QFont.Bold)
        for i in reversed(range(10)):
            label = QtWidgets.QLabel("-", self)
            label.setFont(newFont)
            tickLayout.addWidget(label)
        # Fill the Horizontal Layout EMG0 - Ticks - EMG1
        emgLayout.addWidget(self.progressBarEmg0)
        emgLayout.addLayout(tickLayout)
        emgLayout.addWidget(self.progressBarEmg1)

        # By default the Widget is the Signal One
        self.widget = Signal(self)

        # Fill the main Widget with emgLayout and Widget
        self.mainLayout = QtWidgets.QHBoxLayout(self.mainWidget)
        self.mainLayout.addLayout(emgLayout)
        self.mainLayout.addWidget(self.widget)

        # Window information
        # The Windows have a fixed size (morr easy with game sprites"
        self.setFixedSize(800, 650)
        # Call a custom function to center the windows
        # in the comuter screen
        self.center()
        # define the windws name
        self.setWindowTitle(self.appName)

    def center(self):
        """
            Function call in initUI() to center the app in
            the middle of the computer screen
        """
        # A copy/paste form a StackOverFlow thread :)
        qr = self.frameGeometry()
        cp = QtWidgets.QDesktopWidget().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

    def initTimer(self):
        """
            Function to create Time (Thread) to manage
            the Arduino connection
        """
        # QTimer for Searching Arduino Board on Serial Port
        # Timer is stop after an Action on Menu Connection
        self.arduinoPort = None
        self.arduinoDesc = ""
        self.arduinoPortName = ""
        # Variable to check if Arduino Board is connected
        # Toogle to true after Action on Menu Connect
        # Toogle to false in getData() is exception is catch on serial port
        self.arduinoConnected = False
        self.timerSearchBoard = QtCore.QTimer()
        self.timerSearchBoard.timeout.connect(self.searchArduinoBoard)
        # Search every 500ms
        self.timerSearchBoard.start(500)

        # QTimer for EMG data collection on serial port
        self.timerDataCollection = QtCore.QTimer()
        self.timerDataCollection.timeout.connect(self.getData)
        # get Data every 40ms (25 frame/second)
        self.timerDataCollection.start(40)

    def searchArduinoBoard(self):
        """
            Function that search an arduino Board on serial port
        """
        self.arduinoDesc = ""
        self.arduinoPortName = ""
        # get all the device information connect to
        # the serial port of the computer
        ports = list(comports())
        # Check if there is the "Arduino" string
        # on a serial port description
        for p in ports:
            # if Ardunio find get port information
            if (p.description.startswith("Arduino") or p.description.startswith("ttyACM")):
                self.arduinoDesc = p.description
                self.arduinoPortName = p.device
        # Print Arduino information on The Action of the Connection Menu
        self.arduinoAct.setText(self.arduinoDesc + " -- " + self.arduinoPortName)
        # If we search the Ardunion, the connection is not established
        # so put a usb no connection icon on status bar
        self.label_usb_connection.setPixmap(self.pixmap_usb_ko)
        self.label_usb_name.setText(" -- Not connected")

    def connectArduinoBoard(self):
        """
            Function Activate by Connection Menu
            The goal is to open a serial port to Arduino
        """
        if DEBUG:
            print("Try To connect to Arduino Board")
        try:
            # Open Serial port with Arduino at 115200 bauds
            self.arduinoPort = serial.Serial(self.arduinoPortName, 115200, timeout=0.5)
            # Update the Status bar to say Usb connection ok !
            self.label_usb_connection.setPixmap(self.pixmap_usb_ok)
            self.label_usb_name.setText(" -- Connected to " +
            self.arduinoDesc + " : " + self.arduinoPortName)
            # Search Timer is useless so Stop it
            self.timerSearchBoard.stop()
            # Set variable to True so activate getData() loop
            self.arduinoConnected = True
        except Exception:
            print("Not Able to connect to Arduino")

    def getData(self):
        """
            Function to communicate with Arduino Board and get EMG raw data on serial port
        """
        # Wait that Arduino is connected in function connectArduinoBoard()
        if(self.arduinoConnected):
            try:
                # handshake with Arduino (see Arduino Code)
                self.arduinoPort.write(b's')
                # if the arduino replies
                if (self.arduinoPort.inWaiting()):
                    # read the first reply; convert received data to float and percentage
                    emg0_Value = self.arduinoPort.readline().decode('utf-8')
                    emg0_Value = float(emg0_Value.strip())
                    emg0_Value = emg0_Value/1024.0*100.0
                    # read the second reply; convert received data to float and percentage
                    emg1_Value = self.arduinoPort.readline().decode('utf-8')
                    emg1_Value = float(emg1_Value.strip())
                    emg1_Value = emg1_Value/1024.0*100.0
                    if DEBUG:
                        print('Channel 0: {0}'.format(emg0_Value))
                        print('Channel 1: {0}'.format(emg1_Value))

                    # Update Progress Bar with emg Values
                    self.progressBarEmg0.setValue(int(emg0_Value))
                    self.progressBarEmg1.setValue(int(emg1_Value))
                    # Update the Current Widget with emg Values
                    self.widget.update(emg0_Value, emg1_Value)
            except Exception:
                if DEBUG:
                    print("getData() : Exception")
                # If something goes wrong (lost connection to arduino Board)
                # set vaiable to false and stop getData() loop
                # and restart Timer to search Arduino Board
                self.arduinoConnected = False
                self.timerSearchBoard.start(500)

    def closeEvent(self, event):
        """
            Function call when the windows is closed
        """
        # Stop All Timer
        self.timerSearchBoard.stop()
        self.timerDataCollection.stop()
        if DEBUG:
            print("close Event")

if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    # Set the ORTHOPUS icon on the application
    app.setWindowIcon(QtGui.QIcon('assets/logo.png'))
    ex = MyoCoach()
    ex.show()
    sys.exit(app.exec_())
