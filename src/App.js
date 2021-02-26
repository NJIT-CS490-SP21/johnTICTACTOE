import './Board.css';
import { Board } from './Board.js';
import { useState, useRef, useEffect} from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  
    const inputRef = useRef(null);
    const [userList, setUserList] = useState([]);
    const [username, setUsername] = useState(null);
    const [isShown, setShown] = useState(false);
  
    function onClickButton() {
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
    
    useEffect(() => {
        socket.on('login', (data) => {
            console.log('user has logged in');
            console.log(data);
            setUserList(prevList => [...prevList, data.uName]);
        });
    }, []);
  
  if (isShown) {
    return (
      <div>
        <h1> Welcome to Tic Tac Toe! </h1>
        <div class="mainContain">
            <Board username={username} setUsername={setUsername} userList={userList} setUserList={setUserList} />
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
                    } else {
                        if (uName === username) {
                            return (
                                <div>
                                <h3 class="titleClass"> Spectators: </h3>
                                <div>&emsp;{uName} (You)</div>
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                <h3 class="titleClass"> Spectators: </h3>
                                <div>&emsp;{uName}</div>
                                </div>
                            );
                        }
                    }
                })}
            </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1> Welcome to Tic Tac Toe! </h1>
        <h2> Enter a username before playing </h2>
        <input ref={inputRef} type="text" />
        <button onClick={onClickButton}>Enter Username</button>
      </div>
    ); 
  }
  
  
  
  
}

export default App;
