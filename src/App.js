import './Board.css';
import { Board } from './Board.js';
import { useState, useRef, useEffect} from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  
    const inputRef = useRef(null);
    const [userList, setUserList] = useState([]);
    const [username, setUsername] = useState(null);
    
    //checks if user logged in before showing game
    const [isShown, setShown] = useState(false);
    
    //tells us what the board looks like, whos move it is, and if somebody has won/theres a tie
    const [board, setBoard] = useState(Array(9).fill(null));
    const [moveCount, setCount] = useState(1); //odd = x, even = o
    const winner = calculateWinner(board);
    
    //list of users who clicked replay (can only be the 2 players)
    const [replayClicked, setReplayClicked] = useState([]);
    
    //leaderboard state
    const [leaderboard, setLeaderboard] = useState([]);
  
    function onClickShowBoardButton() {
        if (inputRef != null) {
            const newUsername = inputRef.current.value;
            setUsername(newUsername);
            setUserList(prevList => [...prevList, newUsername]);
            
            setShown(prevShown => {
                return !prevShown;
            });
            
            socket.emit('login', { uName: newUsername});
        }
    }
    
    function replayButton() {
        if (username === userList[0] || username === userList[1]){
            if (username === replayClicked[0] || username === replayClicked[1]) {
                return;
            }
            setReplayClicked(prevList => [...prevList, username]);
            
            socket.emit('replay', { uName: username});
            resetGame();
        } else {
            return;
        }
    }
    
    function resetGame() {
        if(replayClicked.length+1 === 2){
            const boardReset=Array(9).fill(null);
            setBoard(boardReset);
            setCount(1);
            setReplayClicked([]);
            socket.emit('reset', {boardReset: boardReset});
        }
    }
    
    //function taken from https://reactjs.org/tutorial/tutorial.html
    function calculateWinner(board) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
          }
        
        //https://stackoverflow.com/a/35895339
        let notDraw = board.some(function(i) {return i === null});
        
        if (notDraw) {
            return null;
        } else {
            return "draw";
        }
    }
    
    useEffect(() => {
        socket.on('login', (data) => {
            console.log('user has logged in');
            console.log(data);
            setUserList(prevList => [...prevList, data.uName]);
        });
        
        socket.on('leaderboardUpdate', (data) => {
           //set leaderboard to whatever us passed in under data.leaderboard itll be an object of id,username,and score check m1 tips for how to deal with this object
            console.log(data);
            setLeaderboard(data.leaderboard); 
        });
        
        socket.on('replay', (data) => {
            console.log('user has chosen to replay');
            console.log(data);
            setReplayClicked(prevList => [...prevList, data.uName]);
        });
        
        socket.on('reset', (data) => {
            console.log('game is being reset');
            setBoard(data.boardReset);
            setCount(1);
            setReplayClicked([]);
        });
    }, []);
  
  if (isShown) {
    return (
      <div>
        <h1> Welcome to Tic Tac Toe! </h1>
        <div class="boardAndInfoContain">
            <Board username={username} userList={userList} board={board} setBoard={setBoard} moveCount={moveCount} setCount={setCount} winner={winner} socket={socket}/>
            <div class="userInfo">
                <h3 class="titleClass"> Active players: </h3>
                {userList.map((uName) => {
                    if (uName === userList[0]) {
                        if (uName === username) {
                            return <div>&emsp;Player X : {uName} (You)</div>; 
                        } else {
                            return <div>&emsp;Player X : {uName}</div>;
                        }
                    } else if (uName === userList[1]) {
                        if (uName === username) {
                            return <div>&emsp;Player O : {uName} (You)</div>; 
                        } else {
                            return <div>&emsp;Player O : {uName}</div>;
                        }
                    }
                })}
                <h3 class="titleClass"> Spectators: </h3>
                {userList.map((uName, index) => {
                    if (index>1) {    
                        if (uName === username) {
                            return <div>&emsp;{uName} (You)</div>;
                        } else {
                            return <div>&emsp;{uName}</div>;
                        }
                    }
                })}
            </div>
        </div>
        {winner === "X" && (
            <div>
                <h1>{userList[0]} has won the game!</h1>
                <button onClick={replayButton}>Click to play again</button>
                <div>
                    {replayClicked.length === 2 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                            <h4>{replayClicked[1]} wants to play again!</h4>
                        </div>
                    )}
                    {replayClicked.length === 1 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                        </div>
                    )}
                </div>
            </div>
        )}
        {winner === "O" && (
            <div>
                <h1>{userList[1]} has won the game!</h1>
                <button onClick={replayButton}>Click to play again</button>
                <div>
                    {replayClicked.length === 2 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                            <h4>{replayClicked[1]} wants to play again!</h4>
                        </div>
                    )}
                    {replayClicked.length === 1 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                        </div>
                    )}
                </div>
            </div>
        )}
        {winner === "draw" && (
            <div>
                <h1>Its a draw!</h1>
                <button onClick={replayButton}>Click to play again</button>
                <div>
                    {replayClicked.length === 2 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                            <h4>{replayClicked[1]} wants to play again!</h4>
                        </div>
                    )}
                    {replayClicked.length === 1 && (
                        <div>
                            <h4>{replayClicked[0]} wants to play again!</h4>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h1> Welcome to Tic Tac Toe! </h1>
        <h2> Enter a username before playing </h2>
        <input ref={inputRef} type="text" />
        <button onClick={onClickShowBoardButton}>Enter Username</button>
      </div>
    ); 
  }
}

export default App;
