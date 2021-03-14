import React from 'react';
import PropTypes from 'prop-types';

function Box({ onClick, letter }) {
  return (
    <div role="button" tabIndex="0" onClick={onClick} onKeyDown={onClick} className="box">
      {letter}
    </div>
  );
}

Box.propTypes = {
  onClick: PropTypes.func.isRequired,
  letter: PropTypes.string.isRequired,
};

export default Box;
