import json
import subprocess
from threading import Lock
from flask import Flask, jsonify, render_template, request, abort
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO
import serial
from serial.tools.list_ports import comports
import sqlite3 as sql
import ctypes
import ctypes.util
import time
import os
import re
import xml.etree.ElementTree as ET
import xmlschema
from xml.dom import minidom

"""
    MyoCoach application server
    ===========================
    This class aims to manage :
     - Web API methods
     - Static files serving
     - Arduino search, connection and communication
     - Database interactions
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
"""

ALLOWED_EXTENSIONS = {'xml'}

app = Flask(__name__, template_folder='views', static_folder='../public')
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1000 # MAX_CONTENT_LENGTH=1MB
async_mode = None
socketIo = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()
emg_inversion_lock = Lock()
clients_count = 0
arduino_serial_port = None
EmgInputsInverted = False
con = sql.connect('myocoach.db')
print("Opened database successfully")
try:
    con.execute('CREATE TABLE trails (name TEXT UNIQUE, interpolation TEXT, pointArray0 JSON, pointArray1 JSON)')
    print("Table created successfully")
except sql.OperationalError as msg:
    print(msg)
con.close()

trail_xml_schema_file = open('xml/schemas/trail.xsd')
trail_xml_schema = xmlschema.XMLSchema(trail_xml_schema_file)


@app.route('/')
def index():
    try:
        dist_files = get_dist_files()
        return render_template("index.html", dist_files=dist_files)
    except UnboundLocalError as msg:
        hint_message = "Create a bundle js file with the 'npx webpack --config webpack.dev.js' command."
        return render_template("error.html", message=msg, hint_message=hint_message)


@app.route('/api/swapEmgInputs', methods=['POST'])
def swap_emg_inputs():
    global EmgInputsInverted
    if request.method == 'POST':
        with emg_inversion_lock:
            EmgInputsInverted = not EmgInputsInverted
        msg = "EMG inputs have been swapped"
        socketIo.emit('server_event', {'type': 'input_swap', 'message': msg})
        return jsonify({'result': 0, 'message': msg})


@app.route('/api/time', methods=['POST'])
def set_system_time():
    class timespec(ctypes.Structure):
        _fields_ = [("tv_sec", ctypes.c_long), ("tv_nsec", ctypes.c_long)]

    if request.method == 'POST':
        CLOCK_REALTIME = 0
        client_local_time = request.json
        try:
            librt = ctypes.CDLL(ctypes.util.find_library("rt"))
            ts = timespec()
            ts.tv_sec = int(client_local_time["time"] / 1000)
            ts.tv_nsec = (client_local_time["time"] % 1000) * 1000000
            result = librt.clock_settime(CLOCK_REALTIME, ctypes.byref(ts))
        except PermissionError:
            abort(500, description="Set time error, result = " + str(result))
        system_time_ms = round(time.time_ns() / 1000000)
        if result != 0:
            return jsonify(
                {'result': result, 'message': 'System clock could not be set.', 'system_timestamp': system_time_ms})
        else:
            msg = "System datetime has been set."
            socketIo.emit('server_event',
                          {'type': 'set_system_time', 'message': msg, 'system_timestamp': system_time_ms})
            return jsonify({'result': result, 'message': msg, 'system_timestamp': system_time_ms})


@app.route('/api/shutdown', methods=['POST'])
def shutdown_system():
    if request.method == 'POST':
        try:
            subprocess.Popen(['/srv/ledbutton/schedule_shutdown.sh'])
        except PermissionError:
            abort(500, description="Permission error")
        socketIo.emit('server_event',
                      {'type': 'shutdown_system', 'message': 'System is going to shutdown in 10 seconds'})
        return jsonify({'result': 0, 'message': 'System shutdown scheduled in 10 seconds'})


@app.route('/api/reboot', methods=['POST'])
def reboot_system():
    if request.method == 'POST':
        try:
            subprocess.Popen(['/srv/ledbutton/schedule_reboot.sh'])
        except PermissionError:
            abort(500, description="Permission error")
        socketIo.emit('server_event', {'type': 'reboot_system', 'message': 'System is going to reboot in 10 seconds'})
        return jsonify({'result': 0, 'message': 'System reboot scheduled in 10 seconds'})


@app.route('/api/trails', methods=["POST"])
def create_trail():
    if request.method == "POST":
        msg = insert_trail_json(request.json)
        return jsonify({'result': 0, 'message': msg})


@app.route('/api/trails', methods=['GET'])
def list_trails():
    conn = sql.connect("myocoach.db")
    conn.row_factory = sql.Row

    cur = conn.cursor()
    cur.execute("SELECT rowid, name, interpolation, pointArray0, pointArray1 FROM trails")

    rows = cur.fetchall()
    result = []
    for row in rows:
        if row["pointArray0"] is None:
            point_array_0 = None
        else:
            point_array_0 = json.loads(row["pointArray0"])
        if row["pointArray1"] is None:
            point_array_1 = None
        else:
            point_array_1 = json.loads(row["pointArray1"])
        result.append({'id': row["rowid"], 'name': row["name"], 'interpolation': row["interpolation"],
                       'pointArray0': point_array_0, 'pointArray1': point_array_1})
    conn.close()
    return jsonify(result)


@app.route('/api/trails/<int:param>', methods=['GET'])
def get_trail(param: int):
    row = select_trail(param)
    if row is None:
        abort(404, description="Resource not found")
    if row["pointArray0"] is None:
        point_array_0 = None
    else:
        point_array_0 = json.loads(row["pointArray0"])
    if row["pointArray1"] is None:
        point_array_1 = None
    else:
        point_array_1 = json.loads(row["pointArray1"])
    return jsonify({'id': row["rowid"], 'name': row["name"], 'interpolation': row["interpolation"],
                    'pointArray0': point_array_0, 'pointArray1': point_array_1})


@app.route('/api/trails/<int:param>', methods=['DELETE'])
def delete_trail(param: int):
    if request.method == "DELETE":
        try:
            with sql.connect("myocoach.db") as conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM trails WHERE rowid = ?", [param])
            conn.commit()
            msg = "Record successfully deleted"
        except Exception as error:
            conn.rollback()
            msg = "error in delete operation : " + str(error)
            print(error)

        finally:
            conn.close()
            return jsonify({'result': 0, 'message': msg})


@app.route('/download/trail.xml', methods=['POST'])
def export_trail():
    request_json = request.json
    row_id = request_json["id"]
    row = select_trail(row_id)
    trail_el = ET.Element('trail')
    trail_el.set('name', row["name"])
    trail_el.set('interpolation', row["interpolation"])
    if row["pointArray0"] is not None:
        point_array_0_el = ET.SubElement(trail_el, "pointArray0")
        point_array_0 = json.loads(row["pointArray0"])
        for point in point_array_0:
            point_el = ET.SubElement(point_array_0_el, "point")
            point_el.set('time', str(point[0]))
            point_el.set('value', str(point[1]))
    if row["pointArray1"] is not None:
        point_array_1_el = ET.SubElement(trail_el, "pointArray1")
        point_array_1 = json.loads(row["pointArray1"])
        for point in point_array_1:
            point_el = ET.SubElement(point_array_1_el, "point")
            point_el.set('time', str(point[0]))
            point_el.set('value', str(point[1]))
    xml_data = minidom.parseString(ET.tostring(trail_el, encoding='UTF-8')).toprettyxml(indent="  ")
    response = app.response_class(xml_data, mimetype='application/xml')
    response.headers["Content-Disposition"] = "attachment; filename=%s.xml" % row["name"]
    return response


@app.route('/upload/trail', methods=['POST'])
def import_trail():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'result': 1, 'message': 'No file part'})
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return jsonify({'result': 1, 'message': 'No selected file'})
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            try:
                xml_string = file.stream.read()
                xmlschema.validate(xml_string, trail_xml_schema)
                msg = insert_trail_xml(xml_string)
            except Exception as error:
                msg = "trail file import failed : " + str(error)
                print(error)
            finally:
                return jsonify({'result': 0, 'message': msg})


@app.route('/<path:path>')
def catch_all(path):
    print('You want path: %s' % path)
    return index()


@socketIo.on('connect')
def connect():
    global clients_count
    clients_count += 1
    print(clients_count, 'client(s) connected')


@socketIo.on('disconnect')
def disconnect():
    global clients_count
    clients_count -= 1
    print('Client disconnected.', clients_count, 'client(s) remain')


@socketIo.on('client_response')
def client_response(message):
    print(message)
    global thread, clients_count
    with thread_lock:
        if thread is None:
            thread = socketIo.start_background_task(target=serial_thread)


@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({'error': str(e)}), 404


def addDistPrefix(value):
    return "dist/" + value


def get_dist_files():
    current_path = ""
    current_path_array = os.getcwd().split('/')
    for i in range(len(current_path_array)):
        if i == len(current_path_array) - 1:
            current_path += "public/dist/"
        else:
            current_path += current_path_array[i] + '/'
    dist_files = os.listdir(current_path)
    filtered_dist_files = []
    for element in dist_files:
        if re.search("^.*js$", element):
            filtered_dist_files.append(element)
    return map(addDistPrefix, filtered_dist_files)


def board_connected():
    global arduino_serial_port
    arduino_serial_port_device = None
    try:
        for p in comports():
            if str(p.manufacturer).startswith("Arduino"):
                arduino_serial_port_device = p.device
        if arduino_serial_port_device is None:
            raise serial.serialutil.SerialException
        arduino_serial_port = serial.Serial(arduino_serial_port_device, 9600)
        socketIo.emit('board_response', {'data': 'true'})
        return True
    except serial.serialutil.SerialException:
        socketIo.emit('board_response', {'data': 'false'})
        return False


def serial_thread():
    print("serial_thread started")
    board_state = board_connected()
    emg0value, emg1value = (0, 0)
    while True:
        if board_state is True:
            try:
                arduino_serial_port.write(b's')
                if arduino_serial_port.inWaiting():
                    readline = arduino_serial_port.readline().decode("utf-8").strip('\n').strip('\r')
                    if readline != '':
                        readarray = readline.split(":")
                        if readarray[0] != '':
                            emg0value = round((float(readarray[0]) * 100) / 255)
                        if len(readarray) > 1 and readarray[1] != '':
                            emg1value = round((float(readarray[1]) * 100) / 255)
                        time_ms = round(time.time_ns() / 1000000)
                        with emg_inversion_lock:
                            if EmgInputsInverted:
                                socketIo.emit('server_response', {'data': [emg0value, emg1value, time_ms]})
                            else:
                                socketIo.emit('server_response', {'data': [emg1value, emg0value, time_ms]})
                socketIo.sleep(0.04)
            except serial.serialutil.SerialException:
                board_connected()
                socketIo.sleep(2)
            except UnicodeError:
                pass
        else:
            board_state = board_connected()
            socketIo.sleep(2)


def select_trail(trail_id: int):
    conn = sql.connect("myocoach.db")
    conn.row_factory = sql.Row
    cur = conn.cursor()
    cur.execute("SELECT rowid, name, interpolation, pointArray0, pointArray1 FROM trails WHERE rowid = ?", [trail_id])
    row = cur.fetchone()
    conn.close()
    return row


def insert_trail_xml(trail_xml):
    trail_el = ET.fromstring(trail_xml)
    name = trail_el.attrib["name"]
    interpolation = trail_el.attrib["interpolation"]
    point_array_0 = []
    point_array_1 = []
    for point_array in trail_el:
        if point_array.tag == "pointArray0":
            for point in point_array:
                if point.tag == "point":
                    point_array_0.append([int(point.attrib["time"]), int(point.attrib["value"])])
        if point_array.tag == "pointArray1":
            for point in point_array:
                if point.tag == "point":
                    point_array_1.append([int(point.attrib["time"]), int(point.attrib["value"])])

        point_array_0_json = json.dumps(point_array_0)
        point_array_1_json = json.dumps(point_array_1)
    try:
        with sql.connect("myocoach.db") as conn:
            cur = conn.cursor()
            cur.execute("INSERT INTO trails (name, interpolation, pointArray0, pointArray1) VALUES (?, ?, ?, ?)",
                        (name, interpolation, point_array_0_json, point_array_1_json))
            conn.commit()
            msg = "Record successfully added"
    except Exception as error:
        conn.rollback()
        msg = "error in insert operation : " + str(error)
        print(error)
    finally:
        conn.close()
        return msg


def insert_trail_json(trail_json):
    try:
        name = trail_json["name"]
        interpolation = trail_json["interpolation"]
        point_array_0 = json.dumps(trail_json["pointArray0"])
        point_array_1 = json.dumps(trail_json["pointArray1"])
        with sql.connect("myocoach.db") as conn:
            cur = conn.cursor()
            cur.execute("INSERT INTO trails (name, interpolation, pointArray0, pointArray1) VALUES (?, ?, ?, ?)",
                        (name, interpolation, point_array_0, point_array_1))
            conn.commit()
            msg = "Record successfully added"
    except Exception as error:
        conn.rollback()
        msg = "error in insert operation : " + str(error)
        print(error)
    finally:
        conn.close()
        return msg


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == '__main__':
    try:
        socketIo.run(app, host='0.0.0.0', port=5000)
        board_connected()
    except KeyboardInterrupt:
        socketIo.stop()
