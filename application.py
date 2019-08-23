import os

from flask import Flask, render_template, request, session, jsonify, redirect
from flask_socketio import SocketIO, emit, join_room
import datetime
import os

# python -c 'import os; print(os.urandom(16))'

app = Flask(__name__)
app.config["SECRET_KEY"] = b'cowabunga'

socketio = SocketIO(app)

# Arrays to store logged in users, channels and messages
online_users = []
channels = []
#messages = []

all_channels = []

imprint = os.urandom(16)

@app.route("/")
def index():
    #if 'display_name' in session:
     #   return 'All good'

    #else:
    return render_template("index.html", imprint=imprint)

@app.route("/sign_in", methods=['POST'])
def sign_in():

    session['display_name'] = request.form['display_name']
    a = request.form['display_name']
    return f'Great! {a}'

@app.route("/login", methods=['POST'])
def login():
    print(request.form['display_name'])
    if request.form['display_name'] not in online_users:
        print("not in online_users")
        online_users.append(request.form['display_name'])
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
    #session['display_name'] = request.form['display_name']
    #a = request.form['display_name']
    #return f'Great! {a}'

@app.route("/success")
def success():

    return render_template("success.html", channels=channels)

@app.route("/create_channel", methods=['POST'])
def create_channel():
    print(request.form['channel_name'])

    if request.form['channel_name'] not in channels:

        # new code
        this_channel = dict()
        this_channel['name'] = request.form['channel_name']
        this_channel['messages'] = []
        all_channels.append(this_channel)

        channels.append(request.form['channel_name'])

        # legacy code
        # channels.append(request.form['channel_name'])

        return jsonify({'success': True})
    else:
        return jsonify({"success": False})

@app.route("/channel/<string:channel_name>")
def channel(channel_name):
    if channel_name not in channels:
        this_channel = dict()
        this_channel['name'] = channel_name
        this_channel['messages'] = []
        all_channels.append(this_channel)

        channels.append(channel_name)

    return render_template("channel.html", channel_name=channel_name)

@app.route("/send_message", methods=["POST"])
def send_message():

    # universal code
    channel_name = request.form['channel_name']

    # new code

    # finding needed channel
    this_channel = None
    for each in all_channels:
        if each['name'] == channel_name:

            # If there are 100 messages, delete the first
            if len(each['messages']) > 99:
                each['messages'] = each['messages'][1:]

            each['messages'].append({'channel_name': request.form['channel_name'],
                                     "display_name": request.form['display_name'],
                                     'text': request.form['text'],
                                     'year': datetime.datetime.now().year,
                                     'month': datetime.datetime.now().month,
                                     'day': datetime.datetime.now().day,
                                     'hour': datetime.datetime.now().hour,
                                     'minute': datetime.datetime.now().minute,
                                     'second': datetime.datetime.now().second})
            print("Received message")

            print(each['messages'][-1])

            socketio.emit("New message", each['messages'][-1], room=channel_name)
            print(f'sent to {channel_name}')

            break

    return jsonify({'success': True})


@socketio.on('join')
def on_join(data):
    print('Received join')
    room = data['room']
    join_room(room)

    channel_messages = []

    for each in all_channels:
        if each['name'] == room:
            channel_messages = each['messages']
            break
    socketio.emit("Messages total", channel_messages, room=room)
    print(f'A user joined {room}')


if __name__ == '__main__':
    socketio.run(app)
