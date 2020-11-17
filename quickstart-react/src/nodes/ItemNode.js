import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';




export default memo(({ data }) => {
  	return (
	    <>
	        <Handle
                type="target"
                position="left"
                style={{ background: 'var(--color-mud_black)' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />

            <Handle
                type="source"
                position="top"
                style={{ background: 'var(--color-mud_black)' }}
            />

            <Handle
                type="source"
                position="right"
                style={{ background: 'var(--color-mud_black)' }}
            />

            <Handle
                type="source"
                position="bottom"
                style={{ background: 'var(--color-mud_black)' }}
            />

            <h4>{data?.label}</h4>
            <div style={{style:"flex"}}>
                <p>The background color should change based on whether or not it's done, in progress, or stuck.</p>
            </div>

	    </>
    );
});