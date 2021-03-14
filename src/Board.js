import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from './Box';

function Board({ username, userList, board, setBoard, moveCount, setCount, winner, socket }) {
  function onClickSquare(index) {
    if (board[index] != null || winner) {
      return;
    }

    let move = 'ERROR';
    if (username === userList[0] && moveCount % 2 === 1) {
      move = 'X';
      setCount((prevCount) => prevCount + 1);
    } else if (username === userList[1] && moveCount % 2 === 0) {
      move = 'O';
      setCount((prevCount) => prevCount + 1);
    } else {
      return;
    }

    setBoard((prevBoard) => {
      const boardCopy = [...prevBoard];
      boardCopy[index] = move;
      return boardCopy;
    });
    socket.emit('boardMove', { index, move, count: moveCount + 1 });
  }

  useEffect(() => {
    socket.on('boardMove', (data) => {
      setCount(data.count);
      setBoard((prevBoard) => {
        const boardCopy = [...prevBoard];
        boardCopy[data.index] = data.move;
        return boardCopy;
      });
    });
  }, []);

  return (
    <div className="mainBoard">
      {board.map((box, index) => (
        <Box onClick={() => onClickSquare(index)} letter={box} />
      ))}
    </div>
  );
}

Board.propTypes = {
  username: PropTypes.isRequired,
  userList: PropTypes.isRequired,
  board: PropTypes.isRequired,
  setBoard: PropTypes.isRequired,
  moveCount: PropTypes.isRequired,
  setCount: PropTypes.isRequired,
  winner: PropTypes.isRequired,
  socket: PropTypes.isRequired,
};

export default Board;
