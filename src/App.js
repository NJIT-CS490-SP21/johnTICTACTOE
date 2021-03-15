import React, { useState, useRef, useEffect } from 'react';
import './Board.css';
import io from 'socket.io-client';
import Board from './Board';

const socket = io();

function App() {
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState(null);

  //  checks if user logged in before showing game
  const [isShown, setShown] = useState(false);

  //  tells us what the board looks like, whos move it is
  const [board, setBoard] = useState(Array(9).fill(null));
  const [moveCount, setCount] = useState(1); // odd = x, even = o

  //  list of users who clicked replay (can only be the 2 players)
  const [replayClicked, setReplayClicked] = useState([]);

  //  leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  function onClickLoginButton() {
    if (inputRef != null) {
      const newUsername = inputRef.current.value;
      setUsername(newUsername);
      setShown((prevShown) => !prevShown);
      socket.emit('login', { uName: newUsername });
    }
  }

  function onClickBoardButton() {
    setShowLeaderboard((prevState) => !prevState);
  }

  function resetGame() {
    if (replayClicked.length + 1 === 2) {
      const boardReset = Array(9).fill(null);
      setBoard(boardReset);
      setCount(1);
      setReplayClicked([]);
      socket.emit('reset', { boardReset });
    }
  }

  function replayButton() {
    if (username === userList[0] || username === userList[1]) {
      if (username === replayClicked[0] || username === replayClicked[1]) {
        return;
      }
      setReplayClicked((prevList) => [...prevList, username]);

      socket.emit('replay', { uName: username });
      resetGame();
    }
  }

  //  function taken from https://reactjs.org/tutorial/tutorial.html
  function calculateWinner() {
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
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    //  https://stackoverflow.com/a/35895339
    const notDraw = board.some((i) => i === null);

    if (notDraw) {
      return null;
    }
    return 'draw';
  }
  const winner = calculateWinner(board);

  useEffect(() => {
    socket.on('login', (data) => {
      setUserList(data);
    });

    socket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data);
    });

    socket.on('replay', (data) => {
      setReplayClicked((prevList) => [...prevList, data.uName]);
    });

    socket.on('reset', (data) => {
      setBoard(data.boardReset);
      setCount(1);
      setReplayClicked([]);
    });
  }, []);

  useEffect(() => {
    if (winner === 'X') {
      if (username === userList[0]) {
        socket.emit('winner', { winner: userList[0], loser: userList[1] });
      }
    } else if (winner === 'O') {
      if (username === userList[1]) {
        socket.emit('winner', { winner: userList[1], loser: userList[0] });
      }
    }
  }, [winner]);

  //  only seems to work on refresh
  useEffect(() => {
    const cleanup = () => {
      socket.emit('leave', { uName: username });
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [username]);

  if (isShown) {
    return (
      <div>
        <h1> Welcome to Tic Tac Toe! </h1>
        <div className="boardAndInfoContain">
          <Board
            username={username}
            userList={userList}
            board={board}
            setBoard={setBoard}
            moveCount={moveCount}
            setCount={setCount}
            winner={winner}
            socket={socket}
          />
          <div className="userInfo">
            <h3 className="titleClass">Active players:</h3>
            {userList.map((uName) => {
              if (uName === userList[0]) {
                if (uName === username) {
                  return <div>&emsp;Player X : {uName} (You)</div>;
                }
                return <div>&emsp;Player X : {uName}</div>;
              }
              if (uName === userList[1]) {
                if (uName === username) {
                  return <div>&emsp;Player O : {uName} (You)</div>;
                }
                return <div>&emsp;Player O : {uName}</div>;
              }
              return null;
            })}
            <h3 className="titleClass"> Spectators: </h3>
            {userList.map((uName, index) => {
              if (index > 1) {
                if (uName === username) {
                  return <div>&emsp;{uName} (You)</div>;
                }
                return <div>&emsp;{uName}</div>;
              }
              return null;
            })}
          </div>
          {showLeaderboard ? (
            <div>
              <button type="button" onClick={onClickBoardButton}>
                {' '}
                Hide Leaderboard{' '}
              </button>
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">Leaderboard</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard &&
                    leaderboard.map((player) => {
                      if (player.username === username) {
                        return (
                          <tr>
                            <td>{player.username} (you)</td>
                            <td>{player.score}</td>
                          </tr>
                        );
                      }
                      return (
                        <tr>
                          <td>{player.username}</td>
                          <td>{player.score}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <button type="button" onClick={onClickBoardButton}>
                {' '}
                Show Leaderboard{' '}
              </button>
            </div>
          )}
        </div>
        {winner === 'X' && (
          <div>
            <h1>{userList[0]} has won the game!</h1>
            <button type="button" onClick={replayButton}>
              Click to play again
            </button>
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
        {winner === 'O' && (
          <div>
            <h1>{userList[1]} has won the game!</h1>
            <button type="button" onClick={replayButton}>
              Click to play again
            </button>
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
        {winner === 'draw' && (
          <div>
            <h1>Its a draw!</h1>
            <button type="button" onClick={replayButton}>
              Click to play again
            </button>
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
  }
  return (
    <div>
      <h1> Welcome to Tic Tac Toe! </h1>
      <h2> Enter a username before playing </h2>
      <input ref={inputRef} type="text" />
      <button type="button" onClick={onClickLoginButton}>
        Enter Username
      </button>
    </div>
  );
}

export default App;
