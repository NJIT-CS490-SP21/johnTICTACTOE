import React from 'react';

export function Box(props){
    return (
        <div onClick={props.onClick} class="box">{props.letter}</div>
    );
}