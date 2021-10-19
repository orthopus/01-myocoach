# 0113-MyoCoach-DIY :<br>Server Programming Guide

![myocoach](../assets/myocoach.png)

---

The MyoCoach v2.0 application allows the visualization of raw EMG signals and allows users to train by doing exercises or through video games. As it is a web application with a responsive design, it can be accessed using a web browser installed on a desktop workstation or on a mobile device such as a smartphone or a tablet.  

The MyoCoach v2.0 application has been created using the following technologies :
* Back-end development : Python Flask, SQLite, Socket-IO
* Front-end development : TypeScript, React, Material-UI
* Games development : Godot Engine

The original environment board chosen to host the application is a Raspberry Pi 3 model B+ but the installation process remains identical with later versions of Raspberry Pi boards and can probably be adapted for other development boards or desktop workstations running under a GNU/Linux OS.

## OS setup

Download a Raspberry Pi OS Lite image available at the following address from a workstation : https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit

Unzip the downloaded archive to get the image file (.img file extension).

From a terminal, go to the directory where the .img file is then connect a MicroSD card on the workstation (16Gb A1 minimum recommended). The MicroSD card has to be unmounted if it has been mounted automatically.

Then run the following command :

Note : Replace _2021-05-07-raspios-buster-armhf-lite_ by the actual .img file name.

```bash
~> sudo dd bs=1m if=2021-05-07-raspios-buster-armhf-lite.img of=/dev/rdisk2
```

Eject the MicroSD card from the workstation SD slot then insert it in the Raspberry Pi MicroSD slot. Connect a screen, a keyboard and an ethernet cable then power on the Raspberry Pi board. Wait for the system to be ready.

Once the system started, authenticate on the terminal with "pi" user (password: raspberry).

## SSH access

On the Raspberry Pi, enable ssh access allow remote connection from other workstation. Run the following command :

```bash
pi@raspberrypi:~ $ sudo raspi-config
```

Select the following option on the user interface : _3 Interface Options_, _P2 SSH_ then select _Yes_. Finally, select _Finish_ to save configuration and get back to the command prompt.

## Keyboard layout

It may be necessary to configure the type of keyboard used. Run the following command :

```bash
pi@raspberrypi:~ $ sudo raspi-config
```

Select the following option on the user interface : _5 Localisation Options_, _L3 Keyboard_ then follow the instructions to configure the keyboard (for example : Logitech, French-French (legacy, alt.), The default for the keyboard layout, No compose key). Finally, select _Finish_ to save configuration and back to the command prompt.

## Pi password

To change the default password, run the following command :

```bash
pi@raspberrypi:~ $ passwd
```

Then type the current password, the new password and finally confirm.

## Installing system packages

To install software from the Internet it is necessary to wire-up the Raspberry Pi to a router using the Ethernet interface. To do so plug an RJ45 cable on the Ethernet port of the board and connect-it to a router that has a connection to the Internet.

Before installing new components, it may be necessary to get the up-to-date packages list :

```bash
pi@raspberrypi:~ $ sudo apt udpate
```

As well as the packages installed by default :

```bash
pi@raspberrypi:~ $ sudo apt upgrade
```

The MyoCoach setup needs several packages to work properly : Pip3, VirtualEnv, Flask, NodeJs, SQLite.

First add nodesource apt repository in order to be able to get the nodejs packages :

```bash
pi@raspberrypi:~ $ curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
```

Then install the packages :

```bash
pi@raspberrypi:~ $ sudo apt install nodejs git python3-pip python3-flask sqlite3 virtualenv
```

## Application setup

### Get the application code

To get the latest version of the application source code, keep the board connected to the Internet using the Ethernet port and run the following commands :

```bash
pi@raspberrypi:~ $ git clone https://github.com/orthopus/01-myocoach.git
```

### Fetch application dependencies

On the Raspberry Pi, go to the MyoCoach webapp directory :

```bash
pi@raspberrypi:~ $ cd 01-myocoach/src/software/webapp/
```

To get the Python packages, run the following command :

```bash
pi@raspberrypi:~/01-myocoach/src/software/webapp $ sudo pip3 install -r requirements.txt
```

Run the following command to get the nodejs dependencies :

```bash
pi@raspberrypi:~/01-myocoach/src/software/webapp $ npm install
```

### Environment variables and compilation

Create a copy of the _.env.example_ file named _.env_ :

```bash
pi@raspberrypi:~/01-myocoach/src/software/webapp $ cp .env.example .env
```

Then check its content and adapt it if necessary using a text editor :

```bash
pi@raspberrypi:~/01-myocoach/src/software/webapp $ nano .env
```

.env
```bash
NODE_ENV=production
ENDPOINT=http://app.myocoach.lan
```

The run the Webpack compilation with the following command :

```bash
pi@raspberrypi:~/01-myocoach/src/software/webapp $ npx webpack --config webpack.prod.js
```

## Networking

### Hostname

In objective to change the MyoCoach hostname (currently raspberrypi), open the system settings interface with the following commands :

```bash
pi@raspberrypi:~ $ sudo raspi-config
```

On the system settings interface, select _1 System Options_, _S4 Hostname_ then _OK_. Type the new name _"myocoach"_. Select _Finish_ to save the configuration. Finally, select _Yes_ to reboot the system for the changes take effect.

The hostname of the _hosts_ file has to be refreshed to save the new hostname.

```bash
pi@myocoach:~ $ less /etc/hosts
```

hosts
```bash
127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1       myocoach
```

### Avahi configuration

Open the avahi configuration file in order to make MyoCoach get the _"myocoach.lan"_ name on the network :

```bash
pi@myocoach:~ $ sudo nano /etc/avahi/avahi-daemon.conf
```

avahi-daemon.conf
```bash
...
[server]
host-name=myocoach
domain-name=lan
...
```

Restart the service for the changes to take effect with the following commands :

```bash
pi@myocoach:~ $ sudo systemctl reload avahi-daemon
pi@myocoach:~ $ sudo systemctl restart avahi-daemon
```

### Access Point - RaspAP

To enable wireless on the Raspberry Pi use the following command :

```bash
pi@myocoach:~ $ sudo rfkill unblock wlan
```

```bash
pi@myocoach:~ $ curl -sL https://install.raspap.com | bash
```

Then follow the instructions.

Once the Raspberry Pi rebooted, connect to the network raspap-webui (psk: ChangeMe) with the workstation. Go to the access point management interface from the workstation with a web browser at the following address _10.3.141.1_. Authenticate to the interface with the "admin" username (password: secret) then go to the Authentication section to change the password.

### Captive portal

The captive portal is managed by the Nodogsplash application.

```bash
pi@myocoach:~ $ sudo apt-get install libmicrohttpd-dev
```

```bash
pi@myocoach:~ $ sudo mkdir /srv/nodogsplash
pi@myocoach:~ $ sudo chown pi /srv/nodogsplash
pi@myocoach:~ $ sudo chgrp pi /srv/nodogsplash
pi@myocoach:~ $ git clone https://github.com/nodogsplash/nodogsplash.git /srv/nodogsplash
```

To compile Nodogsplash, run the following commands :

```bash
pi@myocoach:~ $ cd /srv/nodogsplash
pi@myocoach:~ $ make
pi@myocoach:~ $ sudo make install
```

Open the configuration file nodogsplash.conf :

```bash
pi@myocoach:~ $ sudo nano /etc/nodogsplash/nodogsplash.conf
```

Change the following lines :

```bash
GatewayInterface wlan0
GatewayAddress 10.3.141.1
```

In the FirewallRuleSet users-to-router object, add the following line :

```bash
FirewallRule allow tcp port 5000
```

Save and close the file.

Remove nodogsplash default captive portal html files :

```bash
pi@myocoach:~ $ sudo rm -rf /etc/nodogsplash/htdocs
```

Then create a link to myocoach captive portal html files :

```bash
pi@myocoach:~ $ sudo ln -s /home/pi/01-myocoach/src/software/captiveportal /etc/nodogsplash/htdocs
```

Open the configuration file dnsmasq.conf :

```bash
pi@myocoach:~ $ sudo nano /etc/dnsmasq.conf
```

Add or change the following line :

```bash
address=/#/10.3.141.1
```

Save and close the file. 

Enable start at boot :

```bash
pi@myocoach:~ $ sudo systemctl enable dnsmasq.service
```

Finally, reboot the system to save the changes.

### Lighttpd configuration

In objective to access the MyoCoach web interface and the RaspAP web interface as well, Lighttpd has to be configured.

First, the RaspAP web interface must have restricted access to the _raspap.myocoach.lan_ subdomain name.

```bash
pi@myocoach:~ $ sudo nano /etc/lighttpd/conf-available/50-raspap-router.conf
```

50-raspap-router.conf
```bash
server.modules += ("mod_rewrite")

$HTTP["host"] == "raspap.myocoach.lan" {
  $HTTP["url"] =~ "^/(?!(dist|app|ajax|config)).*" {
    url.rewrite-once = ( "^/(.*?)(\?.+)?$"=>"/index.php/$1$2" )
    server.error-handler-404 = "/index.php"
  }
}
```

Next, create a new file to declare the virtual host _app.myocoach.lan_.

```bash
pi@myocoach:~ $ sudo nano /etc/lighttpd/conf-available/40-myocoach.conf
```

40-myocoach.conf
```bash
server.modules += ( "mod_proxy" )

# proxy myocoach
$HTTP["host"] == "app.myocoach.lan" {
  proxy.debug = 1
  proxy.server = ( "" => ( ( "host" => "10.3.141.1", "port" => "5000" ) ) )
  proxy.header = ( "upgrade" => "enabled" )
}
```

Then, create a link to activate this new host.

```bash
pi@myocoach:~ $ cd /etc/lighttpd/conf-enabled/
pi@myocoach:~ $ sudo ln -s ../conf-available/40-myocoach.conf
```

At last, reboot the service for the changes to take effect.

```bash
pi@myocoach:~ $ sudo systemctl reload lighttpd
pi@myocoach:~ $ sudo systemctl restart lighttpd
```

## MyoCoach service

Create a link named myocoach in the /srv directory to the webapp directory :

```bash
pi@raspberrypi:~ $ sudo ln -s /home/pi/01-myocoach/src/software/webapp /srv/myocoach
```

Create the MyoCoach systemd service :

```bash
pi@myocoach:~ $ cd /lib/systemd/system
pi@myocoach:/lib/systemd/system $ sudo nano myocoach.service
```

myocoach.service
```bash
[Unit]
Description= Controls myocoach webapp service
Requires= networking.service
After= networking.service

[Install]
WantedBy= multi-user.target

[Service]
Type= simple
User= root
WorkingDirectory= /srv/myocoach/app
ExecStart= /bin/python3 ./app.py
ExecStop= /bin/kill -2 $MAINPID
```

To start the service run the following command :

```bash
pi@myocoah:~ $ sudo systemctl start myocoach.service
```

To enable the service at system boot run the following command :

```bash
pi@myocoah:~ $ sudo systemctl enable myocoach.service
```

The MyoCoach web interface is now reachable at the following address :
_http://app.myocoach.lan_

And the RaspAP web interface is now reachable at the following address :
_http://raspap.myocoach.lan_

## LED Power Button Configuration (optional)

Optionally the MyoCoach can be equipped with a LED Power Button. It allows users to have information about the system state and proceed to a more graceful Power-OFF of the board (ie. cleaner than unplugging the power cable).

Copy the files fetched from the Git repository :

```bash
pi@myocoach:~ $ cp -R 01-myocoach/src/software/ledbutton /srv/
```

Create systemd services :

```bash
pi@myocoach:~ $ cd /lib/systemd/system
pi@myocoach:/lib/systemd/system $ sudo nano enlight_led.service
```

enlight_led.service
```bash
[Unit]
Description= Launch enlight_led.service

[Install]
WantedBy=multi-user.target

[Service]
Type= simple
User= pi
WorkingDirectory= /srv/ledbutton
ExecStart= /bin/bash ./enlight_led.sh
```

```bash
pi@myocoach:/lib/systemd/system $ sudo nano check_color_changed.service
```

check_color_changed.service
```bash
[Unit]
Description= Restarts enlight_led.service
Requires=basic.target
After=basic.target

[Install]
WantedBy=multi-user.target

[Service]
Type= oneshot
ExecStart= /usr/bin/systemctl restart enlight_led.service
```

```bash
pi@myocoach:/lib/systemd/system $ sudo nano check_color_changed.path
```

check_color_changed.path
```bash
[Unit]
Wants= check_color_changed.service

[Path]
PathChanged= /srv/myocoach/ledbutton/led_color.txt

[Install]
WantedBy=basic.target
```

```bash
pi@myocoach:/lib/systemd/system $ sudo nano set_led_color_on_system_startup.service
```

set_led_color_on_system_startup.service
```bash
[Unit]
Description= Set led color on system startup
Requires= basic.target
After=basic.target

[Install]
WantedBy=multi-user.target

[Service]
Type= oneshot
WorkingDirectory= /srv/myocoach/ledbutton
ExecStart= /bin/bash ./set_led_color.sh 255 255 255 0
```

Enable start at boot :

```bash
pi@myocoach:~ $ sudo systemctl enable enlight_led.service
pi@myocoach:~ $ sudo systemctl enable check_color_changed.service
pi@myocoach:~ $ sudo systemctl enable check_color_changed.path
pi@myocoach:~ $ sudo systemctl enable set_led_color_on_system_startup.service
```

Open the configuration file config.txt :

```bash
pi@myocoach:~ $ sudo nano /boot/config.txt
```

Add the following line :

```bash
dtoverlay=gpio-shutdown
```

Save and close the file. Finally, reboot the system to apply the changes.
```bash
pi@myocoach:~ $ sudo reboot
```

## Add new Games

The MyoCoach application has been designed to host video games developed using the Godot environment and that are adapted to use EMG signals as inputs.

Further information about game development with Godot can be found on Godot Engine website : _https://godotengine.org/_

To integrate new games in the MyoCoach environment and make them available from the web application, here are some guide-lines :

As there are only two EMG signals, and thus two possible inputs, the gameplay has to be kept simple. These EMG signals are mapped to InputEventMouseMotion in order to keep the "analog" values of signals. Depending on the game design, the value of EMG signals can be used as proportional inputs directly or to trigger events when they exceed a defined threshold.

A folder has to be created under the public/games/ directory for each hosted game. As an exemple to add "Squash" game, run the following command :

```bash
pi@myocoach:~ $ cd /srv/myocoach/public/games/ 
pi@myocoach:/srv/myocoach/public/games $ mkdir squash
```

From the Godot development environment, the games must be exported using an HTML5 template. Once exported, if the name of the export chosen is _game.html_, then get the files _game.pck_ and _game.wasm_ copy them in the freshly created folder.

```bash
pi@myocoach:/srv/myocoach/public/games $ ls squash/
game.pck  game.wasm
```

For each game a description with its metadata must be indicated in the _gamelist.json_ file.

Open the _gamelist.json_ with a text editor to add the necessary info :

```bash
pi@myocoach:/srv/myocoach/public/games $ nano gamelist.json
```

As an example, for a MyoCoach setup with the games "FlappyPoulpy" and "Squash" installed, _gamelist.json_ might contain the following lines :

gamelist.json
```json
[
  {
    "name": "FlappyPoulpy",
    "url": "/flappypoulpy",
    "path": "flappypoulpy",
    "width": 340,
    "height": 256,
    "fileSizes": {
      "/public/games/flappypoulpy/game.pck": 1191008,
      "/public/games/flappypoulpy/game.wasm": 18131449
    }
  },
  {
    "name": "Squash",
    "url": "/squash",
    "path": "squash",
    "width": 640,
    "height": 400,
    "fileSizes": {
      "/public/games/squash/game.pck": 16352,
      "/public/games/squash/game.wasm": 18149419
    }
  }
]
```

Once the information filled in, save and close the file.

The file size information for _game.pck_ and _game.wasm_ can be found looking in the _game.html_ file that has been generated during the export. It is important to fill in this information in order to make the game loader work properly.

The screen dimensions (width and height in number of pixels) are the default game screen dimensions that can be found in Godot development environment. It is important to fill in this information in order to make the MyoCoach web application keep the game's screen aspect ratio whatever the device screen size is.
