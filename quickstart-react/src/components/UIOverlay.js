import React from 'react';

let UIOverlay = props => {
    return (
        <div style={{
            zIndex: "100",
            position: "absolute",
            top: "0px", bottom: "0px", right: "0px", left: "0px",
            visibility: "hidden"
        }}>
            <span className="ui-overlay-item">
                {props?.children}
            </span>
        </div>
    );
}

export { UIOverlay };
export default UIOverlay;