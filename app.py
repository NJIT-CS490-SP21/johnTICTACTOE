"""This module is the main server for our tic tac toe game,
    it is made using flask (and other imports seen below)"""
import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')

APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating DB variable to prevent
# circular import issues
import models

DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

USER_LIST = []


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """"This function is used for initial setup"""
    return send_from_directory('./build', filename)


@SOCKETIO.on('connect')
def on_connect():
    """"This function is used when socket receives a connection"""
    print('User connected!')


@SOCKETIO.on('disconnect')
def on_disconnect():
    """"This function is used when socket receives a disconnect"""
    print('User disconnected!')


def get_leaderboard():
    """Used to make following functions more modular"""
    all_players = DB.session.query(models.Player).order_by(
        models.Player.score.desc())
    leaderboard = []
    for player in all_players:
        leaderboard.append({
            'username': player.username,
            'score': player.score
        })
    return leaderboard


def add_player(username):
    """Used to make following functions more modular"""
    new_user = models.Player(username=username, score=100)
    DB.session.add(new_user)
    DB.session.commit()


def update_user_list(name, command):
    """Used to make following functions more modular"""
    if command == "add":
        USER_LIST.append(name)
    if command == "remove":
        USER_LIST.remove(name)
    return USER_LIST


@SOCKETIO.on('login')
def on_login(data):
    """"This function is used when the socket receives a login event,
        updating the users in the DB and sending back the updated userlist and database"""
    print(data)
    update_user_list(data['uName'], "add")
    #below line with help from
    #stackoverflow.com/questions/2546207/does-sqlalchemy-have-an-equivalent-of-djangos-get-or-create
    already_in_db = DB.session.query(
        models.Player).filter_by(username=data['uName']).first()
    if not already_in_db:
        add_player(data['uName'])
    leaderboard = get_leaderboard()
    SOCKETIO.emit('login', USER_LIST, broadcast=True, include_self=True)
    SOCKETIO.emit('leaderboardUpdate',
                  leaderboard,
                  broadcast=True,
                  include_self=True)


def winner_and_loser(names):
    """Used to make following functions more modular"""
    winner = names['winner']
    loser = names['loser']
    return [winner, loser]


@SOCKETIO.on('winner')
def on_winner(data):
    """"This function is used when socket receives a winner event,
        it will tell the database to update the scores of the winner/loser
        and then send back the updated database"""
    names = winner_and_loser(data)
    winner_name = names[0]
    loser_name = names[1]
    DB.session.query(models.Player).filter_by(username=winner_name).update(
        {"score": (models.Player.score + 1)})
    DB.session.query(models.Player).filter_by(username=loser_name).update(
        {"score": (models.Player.score - 1)})
    DB.session.commit()
    leaderboard = get_leaderboard()
    SOCKETIO.emit('leaderboardUpdate',
                  leaderboard,
                  broadcast=True,
                  include_self=True)


@SOCKETIO.on('leave')
def on_leave(data):
    """"This function is used when the socket receives a leave event,
        it should remove the user that left from the list of curent users,
        and then send out that updated list"""
    print(data)
    update_user_list(data['uName'], "remove")
    print(USER_LIST)
    SOCKETIO.emit('login', USER_LIST, broadcast=True, include_self=False)


@SOCKETIO.on('replay')
def on_replay(data):
    """"This function is used when the socket receives a replay event,
        which then sends to all users that the user that clicked replay wants to replay"""
    SOCKETIO.emit('replay', data, broadcast=True, include_self=False)


@SOCKETIO.on('reset')
def on_reset(data):
    """"This function is used when the socket receives a reset event,
        and then sends out an event which tells all users to reset the board"""
    SOCKETIO.emit('reset', data, broadcast=True, include_self=False)


@SOCKETIO.on('boardMove')
def on_board_move(data):
    """"This function is used when the socket receives a board move,
        and then sends out an event which tells all users where that move was"""
    SOCKETIO.emit('boardMove', data, broadcast=True, include_self=False)


if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
