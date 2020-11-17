import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';



// todo: make color of node change based on whether or not it's finished
// todo: make the color of the dependent nodes change based on whether or not it's finished


export default memo(({ data }) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                id="t"
                style={{ background: 'var(--color-mud_black)' }}
            />
            <Handle
                type="source"
                position="right"
                id="r"
                style={{ background: 'var(--color-mud_black)' }}
            />
            <Handle
                type="source"
                position="bottom"
                id="b"
                style={{ background: 'var(--color-mud_black)' }}
            />
            <Handle
                type="source"
                position="left"
                id="l"
                style={{ background: 'var(--color-mud_black)' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />

            <h4>{data?.label}</h4>
            <div style={{ maxWidth: "150px" }}>
                <h4>Group: {data?.group}</h4>
                <p>{data?.title}</p>
            </div>

        </>
    );
});