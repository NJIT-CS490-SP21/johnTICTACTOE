import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

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
    #database adding new user, we should also query the databse and emit the whole thing back to client when they login
    new_user = models.Player(username=data['uName'], score=100)
    db.session.add(new_user)
    db.session.commit()
    all_players = models.Player.query.all()
    leaderboardData={'leaderboard': all_players}
    socketio.emit('login', data, broadcast=True, include_self=False)
    socketio.emit('leaderboardUpdate', leaderboardData, broadcast=True, include_self=True)
    
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

if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
