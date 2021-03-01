import React from 'react';

const Emoji = props => (
    <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.labe : "" }
    aria-hidden={props.label ? "false" : "true" }
    >
        {props.symbol}
    </span>
)

export default Emoji;