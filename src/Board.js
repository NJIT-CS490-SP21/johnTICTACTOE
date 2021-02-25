import React from 'react';
import { useState, useRef, useEffect} from 'react';
import { Box } from './Box.js';
import io from 'socket.io-client';

const socket = io();

export function Board(){
    
    const inputRef = useRef(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [userList, setUserList] = useState([]);
    const [username, setUsername] = useState(null);
    const [isShown, setShown] = useState(false);
    const [moveCount, setCount] = useState(1); //odd = x, even = o

    function onClickSquare(index) {
        if (board[index] != null) {
            return;
        }
        
        let move = "ERROR";
        if (username === userList[0] && moveCount%2===1) {
            move = "X";
            setCount((prevCount) => {
                return prevCount+1;
            });
        } else if (username === userList[1] && moveCount%2===0) {
            move = "O";
            setCount((prevCount) => {
                return prevCount+1;
            });
        } else {
            console.log(moveCount);
            return;
        }
        
        setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[index] = move;
            socket.emit('boardMove', { index: index, move: move, count: moveCount+1});
            return boardCopy;
        });
    }
    
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
        socket.on('boardMove', (data) => {
            console.log('move has been received');
            console.log(data);
            
            setCount(data.count);
            
            setBoard(prevBoard => {
                const boardCopy = [...prevBoard];
                boardCopy[data.index] = data.move;
                return boardCopy;
            });
        });
        
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
                <div class="mainBoard">
                    {board.map((box, index) => (<Box onClick={() => onClickSquare(index)} letter={box} />))}
                </div>
                <div>
                    <h3> List of current players: </h3>
                    {userList.map((uName) => {
                        if (uName === username) {
                            return <div>{uName} (You)</div>; 
                        } else {
                            return <div>{uName}</div>;
                        }
                    })}
                </div>
            </div>
        );
    } else {
       return (
            <div>
                <h1> Enter a username before playing </h1>
                <input ref={inputRef} type="text" />
                <button onClick={onClickButton}>Enter Username</button>
            </div>
        ); 
    }
}