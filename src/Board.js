import React from 'react';
import { useState, useRef, useEffect} from 'react';
import { Box } from './Box.js';
import io from 'socket.io-client';

const socket = io();

export function Board(props){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [moveCount, setCount] = useState(1); //odd = x, even = o

    function onClickSquare(index) {
        if (board[index] != null) {
            return;
        }
        
        let move = "ERROR";
        if (props.username === props.userList[0] && moveCount%2===1) {
            move = "X";
            setCount((prevCount) => {
                return prevCount+1;
            });
        } else if (props.username === props.userList[1] && moveCount%2===0) {
            move = "O";
            setCount((prevCount) => {
                return prevCount+1;
            });
        } else {
            return;
        }
        
        setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[index] = move;
            socket.emit('boardMove', { index: index, move: move, count: moveCount+1});
            return boardCopy;
        });
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
    }, []);
    
    
    
    return (
        <div class="mainBoard">
            {board.map((box, index) => (<Box onClick={() => onClickSquare(index)} letter={box} />))}
        </div>
    );
    
}