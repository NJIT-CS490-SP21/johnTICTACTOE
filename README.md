# Project 2 - Tic Tac Toe

##TODO:
1. add install requirments for database miletone
2. add heroku deploy instructions for databse stuff along with the current stuff
3. add instructions for setting up .env file with database url
4. add answers to rubic questions

## Heroku site link for milestone 1: https://serene-sands-43727.herokuapp.com/
* As of right now, all users must open the app before anyone logs in for things to work properly.

## Technologies, Frameworks, Libraries
* Technologies: Cloud9, Heroku, Python, JavaScript, HTML, CSS
* Frameworks: Flask
* Libraries: React.js, os, socketio, cors, SQLAlchemy, dotenv

## Install Requirements (Milestone 1)
* `npm install`
* `pip install -r requirements.txt`
* `pip install flask`
* `pip install flask-socketio`
* `pip install flask-cors`
* `npm install socket.io-client --save`

## Initial Setup
1. Clone this repository to your own personal one
2. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
* As of right now, all users must open the app before anyone logs in for things to work properly.

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Questions from rubric
* **_Technical Issues encountered_**: 
   1. 
* **_Known Problems / Additional Features_**:
   1. 