import React from 'react';

let Card = props => {
    return (
        <div style={{ margin: "10px", border: "solid", padding: "5px" }}
            className="m-4">
            {props?.content}
        </div>
    );
}

export { Card };
export default Card;