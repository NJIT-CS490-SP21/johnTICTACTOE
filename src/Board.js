import React from 'react';
import { useState, useRef, useEffect} from 'react';
import { Box } from './Box.js';
import io from 'socket.io-client';

const socket = io();

export function Board(){
    
    const [board, setBoard] = useState(Array(9).fill(null));

    function onClickSquare(index) {
       // const newBoard = [...board];
       // newBoard[index]="X";
       // setBoard(newBoard);
       // socket.emit('boardMove', { message: index });
        
        setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[index] = "X";
            socket.emit('boardMove', { message: index });
            return boardCopy;
        });
    }
    
    useEffect(() => {
        socket.on('boardMove', (data) => {
            //const newBoard = [...board];
            //newBoard[data.message]="X";
            //setBoard(newBoard);
            
            setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[data.message] = "X";
            return boardCopy;
            });
        });
    }, []);
    
    return (
        <div class="mainBoard">
            {board.map((box, index) => (<Box onClick={() => onClickSquare(index)} letter={box} />))}
        </div>
    );
}