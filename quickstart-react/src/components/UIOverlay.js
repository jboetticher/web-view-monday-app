import React from 'react';

let UIOverlay = props => {
    return (
        <div style={{
            padding: "8px",
            position: "absolute"
        }}
            className="m-4">
            {props?.children}
        </div>
    );
}

export { UIOverlay };
export default UIOverlay;