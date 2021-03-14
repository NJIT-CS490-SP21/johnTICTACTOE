"""This module is used to create the table inside of our database"""
from app import DB


class Player(DB.Model):
    """This class is the creation of our database table schema"""
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(100), unique=True, nullable=False)
    score = DB.Column(DB.Integer)

    def __repr__(self):
        return '<Player %r>' % self.username
