# Project 2 - Tic Tac Toe

## Heroku site link for milestone 1: https://serene-sands-43727.herokuapp.com/

## Technologies, Frameworks, Libraries
* Technologies: Cloud9, Heroku, Python, JavaScript, HTML, CSS
* Frameworks: Flask
* Libraries: React.js, os, socketio, cors

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

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Questions from rubric
* **_Technical Issues encountered_**: 
   1. One major technical issue I had was that the states were not being updated immediately. For example, after updating the `moveCount` state I was sending an emit to all other users that contained that `moveCount` state. After some research I found that the issue here is that because setState is asynchronous, it was not yet updated when sent in that emit. I got around this by adding 1 to the value I was emitting, and this ended up working perfectly for me. I had also seen that another work around was to use a callback function, but unfortunatly that only works with class components and not functional components. For functional components useEffect can be used in a similar way, but I did not have time to try this before the due date.
   2. Another technical issue I encountered was setting the board state. I was having trouble at first because I was trying use the actual reference to `board` to copy its state instead of using something like the `prevBoard` function we learned during class. After some research and help in class, I was able to figure out what exactly I needed to do to update the board and actually keep those changes.
* **_Known Problems / Additional Features_**:
   1. Currently, there is a problem where the list of current players/spectators does not update as they leave. To solve this problem, I believe I would need to have an ongoing list in app.py that updates as users login and disconnet. From this list I'm hoping I'll be able to emit an event to all users whenever the list is changed. This will take more research and more testing, which I don't have enough time to get done before milestone 1 is due.
   2. Another current problem is that I want the text at the bottom of the screen that pops up saying "Player ... wants to play again!" to show that both players hit the accept button for a couple seconds before the board resets and the text disappears. I believe that I might be able to achieve this with some combination of `async` and `await` but I need to do more research and testing, and again I don't have enough time to get this done before milestone 1 is due.
        
