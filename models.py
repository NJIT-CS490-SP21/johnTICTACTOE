from app import db

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    score = db.Column(db.Integer)
    
    def __repr__(self):
        return '<Player %r>' % self.username