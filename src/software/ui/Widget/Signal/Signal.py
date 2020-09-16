#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    Signal Widget
    ============
    
    A simple Widget to show the raw signal of emg sensor
    
    - Initiate Matplotlib axes
    - plot Emg signal
    
    Author: David Gouaillier
    Website: orthopus.com
    Last edited: March 2019
"""

from PyQt5 import QtWidgets
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np
from collections import deque

class Signal(QtWidgets.QWidget):
    def __init__(self, parent):
        super(Signal, self).__init__()
        self.parent = parent
        # define a Time variable use in plot function
        self.time = np.arange(0.0, 50, 1)
        # signal data is stock in a deque container
        # with a length of 50 elements
        self.emg0 = deque(50*[0.0], 50)
        self.emg1 = deque(50*[0.0], 50)
        self.initUI()

    def initUI(self):
        """ Create figure, axes and canvas for graph visualisation """
        # Create a layout that will contain the signal plot
        layout = QtWidgets.QHBoxLayout(self)
        self.fig = Figure()
        self.axes = self.fig.add_subplot(111)
        self.canvas = FigureCanvas(self.fig)
        self.canvas.setParent(self)
        # make figure transparent
        self.fig.set_facecolor("none")
        self.axes.set_facecolor("none")
        self.canvas.setStyleSheet("background-color:transparent;")
        # Add canvas to layout
        layout.addWidget(self.canvas)
        # Add strecth ta layout to avoid bad widget position in main GUI
        layout.addStretch(0)
        # call the plot once to draw empty axe on the widget
        # even if arduino is not connected
        self.plot()

    def plot(self):
        """ Function to visualize nicely the emg data """
        self.axes.clear()
        # Define axes limit
        self.axes.set_ylim(0.0, 100.0)
        self.axes.set_xlim(0.0, 50.0)
        self.axes.grid(True)
        # Define tick for vertical axes (every 10%)
        self.axes.yaxis.set_ticks(range(0,110,10))
        # Use the function fill_between() for nice view :)
        self.axes.fill_between(self.time, 0.0, self.emg0, facecolor='blue', alpha=0.5, label='Channel 0')
        self.axes.fill_between(self.time, 0.0, self.emg1, facecolor='red', alpha=0.5, label='Channel 0')
        # Add grey zone for filtered data
        # Effective signal is between [15% to 85%] of emg
        self.axes.axhspan(0.0, 15.0, facecolor='grey', alpha=0.2)
        self.axes.axhspan(85.0, 100.0, facecolor='grey', alpha=0.2)
        # Add legend and custom position out of figure
        self.axes.legend(loc='upper center', bbox_to_anchor=(0.5, 1.15), framealpha=0.0)
        self.canvas.draw()

    def update(self, emg0_Value, emg1_Value):
        """ Get the EMG Value [0 -> 100] and plot them """
        self.emg0.append(emg0_Value)
        self.emg1.append(emg1_Value)
        self.plot()
