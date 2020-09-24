# 0113-MyoCoach-DIY :<br>Contributing

First off, thanks for taking the time to contribute! :+1:

## MyoCoach v1 review
:heavy_plus_sign: The project has a nice doc and a user's manual (And it is not the case of all Open Source projects...)

:heavy_plus_sign: It works! The prototype is functional and can be used to train for the use of EMG sensors

:heavy_plus_sign: The Signal Widget is very useful for the CPO. It allows to place correctly the electrodes for a functional socket. It also allows users to understand EMG sensors well.

:heavy_plus_sign: The Widget Game with a Flappy Bird clone is interesting for the patient and the gameplay of the game is adapted to EMG sensors.
speed of the bird's movement)

:heavy_minus_sign: 3D printing and welding are required to produce the MyoCoach housing. This is quite complicated and this will put off many CPO who are not Makers.

:heavy_minus_sign: Installing the MyoCoach software requires a good level of geekiness. And under Windows, it must be death.

:heavy_minus_sign: You need a computer to use the MyoCoach. So it is difficult for the patient to go home for training (or install it on his own computer if he has one at home).

## MyoCoach v2

The Major improvement that ORTHOPUS team want is to **remove the use of a personal computer** and to decrease the complexity of MyoCoach software installation.

Our idea is to use the smartphone instead as the application screen.

* A Raspberry PI board run the MyoCoach application into a web browser.
* The Raspberry PI get the analog signal form a DAC board (or arduino board).
* The user only have to connect to Raspberry PI hotspot wifi (with smartphone or PC) and connect to the good web page to get access to the MyoCoach functionalities (widget signal and game).

The main problem in this solution is to recode all the MyoCoach application in javascript :)
