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

    function onClickSquare(index) {
        if (board[index] != null) {
            return;
        }
        setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[index] = "X";
            socket.emit('boardMove', { message: index });
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
            
            socket.emit('login', { message: newUsername});
            
            
        }
    }
    
    useEffect(() => {
        socket.on('boardMove', (data) => {
            console.log('move has been received');
            console.log(data);
            setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[data.message] = "O";
            return boardCopy;
            });
        });
        
        socket.on('login', (data) => {
            console.log('user has logged in');
            console.log(data);
            setUserList(prevList => [...prevList, data.message]);
        });
    }, []);
    
    
    if (isShown) {
        return (
            <div>
                <div class="mainBoard">
                    {board.map((box, index) => (<Box onClick={() => onClickSquare(index)} letter={box} />))}
                </div>
            </div>
        );
    } else {
       return (
            <div>
                <input ref={inputRef} type="text" />
                <button onClick={onClickButton}>Enter Username</button>
            </div>
        ); 
    }
}