# Project 2 - Tic Tac Toe

## Heroku site link for milestone 2: https://pure-retreat-29979.herokuapp.com/
* As of right now, all users must open the app before anyone logs in for things to work properly.

## Technologies, Frameworks, Libraries
* Technologies: Cloud9, Heroku, Python, JavaScript, HTML, CSS
* Frameworks: Flask
* Libraries: React.js, os, socketio, cors, SQLAlchemy, dotenv

## Install Requirements (Milestone 1+2)
* `npm install`
* `pip install -r requirements.txt`
* `pip install flask`
* `pip install flask-socketio`
* `pip install flask-cors`
* `npm install socket.io-client --save`
* `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`
* `pip install psycopg2-binary`
* `pip install Flask-SQLAlchemy==2.1`

## Initial Setup
1. Clone this repository to your own personal one
2. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
* As of right now, all users must open the app before anyone logs in for things to work properly.

## Deploy to Heroku
1. First login: `heroku login -i`
2. Create a Heroku app: `heroku create --buildpack heroku/python`
3. Add a database: `heroku addons:create heroku-postgresql:hobby-dev`
4. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
5. Grab the database URL: `heroku config`
6. Put the database URL in your .env: `touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" > .env`
7. Push to Heroku: `git push heroku main`

## Questions from rubric
* **_Technical Issues encountered_**: 
   1. One technical issue I had was that the moves for each player were being sent to the server twice. After reading through my code and following the flow, I found out that this was because I was sending an emit inside of the `setBoard` function in `Board.js`. After moving it to the outside of the function, it no longer would emit twice.
   2. Another issue I encounterd was when I was trying to emit the winner inside of the `calculateWinner` function. The issue here was that it would keep emiting over and over again until the database crashed. I solved it orginally by creating an if statement that tracked how many times the winner was emited, but this ended up becoming more and more complicated to update and keep that tracked number consistent. I instead created a much simpler solution useing `useEffect` and passing the result of the `calculateWinner` function as a dependecy. This way it would only emit when a winner is selected (it also includes a little more logic to make sure its not emitting a tie or the wrong winner).
* **_Known Problems / Additional Features_**:
   1. Currently, there is a problem where the list of current players/spectators does not update as they leave. I attempted to solve this by trying to emit an event on referesh/tab close, but I could only get this event to emit on refresh. I have tried many different solutions to try and catch a tab close event, but none seem to work. This may be due to something with cloud9, but I believe I will need to attend office hours to try and work out a solution. Thankfully, this is just something that I want to add personally, and not a requirement for the project (as it was removed).
   2. Another problem thats related to the one above is that in order for the app to work properly, all users must have their tab open before anyone logs in. Solving the problem above and being able to keep a consistent list of active users in the server would be the first step to solving this problem, but I want to be able to remove users as they leave before I keep a list in the server (as this list would keep getting longer and longer until the server is reset).