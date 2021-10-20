# 0113-MyoCoach-DIY :<br>Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
* Add log system to store user information (sensor gain, game record, ...)

## [v2.0.0] - 2021-10-18
### Update
* Complete rewrite of the MyoCoach implementation using web technologies
* Installation based on a Raspberry Pi board with a Wi-Fi access point for an easier system setup
* Modern responsive web user interface
* Training exercises integration with custom trails management
* Framework for video games integration
* Convenient features such as fullscreen mode, night/day mode, EMG inputs swapping, system clock setting, system reboot or shutdown.
* Integration of a LED power button to the board that indicates system status (optional)
* Updated user-manual.md guide
* Updated arduino firmware file for an optimised EMG signal acquisition
* Monitoring of system components connectivity
### Added
* Added server-programming-manual.md guide

### Removed
* v.1.0 Graphical UI application code (src/software/ui/)
* Deleted ui-programming manual.md

## [v1.0.1] - 2020-09-24
### Fixed
* Add the CONTRIBUTING file about MyoCoach v2.0 ORTHOPUS ideas.

## [v1.0.0] - 2020-09-18
### Added
* The first full functional version of the MyoCoach with Arduino board and UI desktop application in Python