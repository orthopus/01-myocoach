# 0113-MyoCoach-DIY :<br>UI Programming Manual

This desktop application allows the visualization of raw EMG signals and allows users to train by observing the raw signals or through a game which is a clone inspired by [FlapPyBird](https://github.com/sourabhv/FlapPyBird) with a different game system.

The MyoCoach application is based on python3 with PyQt5.

## Installation

Tested under MacOS and Linux.

**:one: Installing the dependencies**

Install the following packages :
* [Python](https://www.python.org/downloads) (3.6.x or higher) ;
* [pip](https://techworm.net/programming/install-pip-python-mac-windows-linux/) (20.0.x or later);

Install `virtualenv` :
```
pip install virtualenv
```

**:two: Installing the main program**

Open a terminal, go to the `src/software/ui` folder and launch the installation :

```
$ cd src/software/ui/
make install
```

This command creates a _virtualenv_ and installs the necessary dependencies for the application. These dependencies are listed in the [src/software/ui/requirements.txt](../src/software/ui/requirements.txt) file.

**:three: Launch the application**

```
$ make play
```

## ScreenShot

![Signal Widget](assets/screenShot_signal.png)
![FlappyBird Widget](assets/screenShot_flappybird.png)
