import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';



// todo: make color of node change based on whether or not it's finished
// todo: make the color of the dependent nodes change based on whether or not it's finished


export default memo(({ data }) => {
    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{ background: 'var(--color-mud_black)' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <h4>{data?.label}</h4>
            <div style={{style:"flex"}}>
                <p>The background color should change based on whether or not it's done, in progress, or stuck.</p>
            </div>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ background: 'var(--color-mud_black)' }}
            />
        </>
    );
});