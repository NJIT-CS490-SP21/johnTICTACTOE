import React from 'react';
import { useState, useRef, useEffect} from 'react';
import { Box } from './Box.js';

export function Board(props){
    
    function onClickSquare(index) {
        if (props.board[index] != null  || props.winner) {
            return;
        }
        
        let move = "ERROR";
        if (props.username === props.userList[0] && props.moveCount%2===1) {
            move = "X";
            props.setCount((prevCount) => {
                return prevCount+1;
            });
        } else if (props.username === props.userList[1] && props.moveCount%2===0) {
            move = "O";
            props.setCount((prevCount) => {
                return prevCount+1;
            });
        } else {
            return;
        }
        
        props.setBoard(prevBoard => {
            const boardCopy = [...prevBoard];
            boardCopy[index] = move;
            props.socket.emit('boardMove', { index: index, move: move, count: props.moveCount+1});
            return boardCopy;
        });
    }
    
    useEffect(() => {
        props.socket.on('boardMove', (data) => {
            console.log('move has been received');
            console.log(data);
            props.setCount(data.count);
            props.setBoard(prevBoard => {
                const boardCopy = [...prevBoard];
                boardCopy[data.index] = data.move;
                return boardCopy;
            });
        });
    }, []);
    
    return (
        <div class="mainBoard">
            {props.board.map((box, index) => (<Box onClick={() => onClickSquare(index)} letter={box} />))}
        </div>
    );
    
}