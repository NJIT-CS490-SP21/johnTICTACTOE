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

userList = []

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
    userList.append(data['uName'])
    new_user = models.Player(username=data['uName'], score=100)
    #below line with help from https://stackoverflow.com/questions/2546207/does-sqlalchemy-have-an-equivalent-of-djangos-get-or-create
    alreadyInDB = db.session.query(models.Player).filter_by(username=data['uName']).first()
    if not alreadyInDB:
        db.session.add(new_user)
        db.session.commit()
    all_players = db.session.query(models.Player).order_by(models.Player.score.desc())
    leaderboard = []
    for player in all_players:
        leaderboard.append({'username':player.username, 'score':player.score})
    socketio.emit('login', userList, broadcast=True, include_self=True)
    socketio.emit('leaderboardUpdate', leaderboard, broadcast=True, include_self=True)

@socketio.on('winner')
def on_winner(data):
    print(data)
    winnerName = data['winner']
    loserName = data['loser']
    db.session.query(models.Player).filter_by(username=winnerName).update({"score": (models.Player.score +1)})
    db.session.query(models.Player).filter_by(username=loserName).update({"score": (models.Player.score -1)})
    db.session.commit()
    all_players = db.session.query(models.Player).order_by(models.Player.score.desc())
    leaderboard = []
    for player in all_players:
        leaderboard.append({'username':player.username, 'score':player.score})
    socketio.emit('leaderboardUpdate', leaderboard, broadcast=True, include_self=True)
    
@socketio.on('leave')
def on_leave(data):
    print(data)
    userList.remove(data['uName'])
    print(userList)
    socketio.emit('login', userList, broadcast=True, include_self=False)

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
