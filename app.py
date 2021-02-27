import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('connect')
def on_connect():
    print('User connected!')

@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@socketio.on('login')
def on_login(data):
    print(data)
    socketio.emit('login', data, broadcast=True, include_self=False)
    
@socketio.on('replay')
def on_replay(data):
    print("user wants to replay: "+str(data))
    socketio.emit('replay', data, broadcast=True, include_self=False)

@socketio.on('reset')
def on_reset(data):
    print("game is being reset")
    socketio.emit('reset', data, broadcast=True, include_self=False)

@socketio.on('boardMove')
def on_boardMove(data):
    print(str(data))
    socketio.emit('boardMove', data, broadcast=True, include_self=False)

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
