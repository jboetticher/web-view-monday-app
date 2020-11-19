import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';



// todo: make color of node change based on whether or not it's finished
// todo: make the color of the dependent nodes change based on whether or not it's finished


export default memo(({ data }) => {
    return (
        <>
            <div style={{
                position: "fixed",
                background: data?.groupColor,
                height: "16px",
                borderRadius: "8px",
                top: "0px", left: "0px", right: "0px",
            }}>
                <div style={{
                    position: "absolute",
                    background: data?.groupColor,
                    height: "8px",
                    bottom: "0px", left: "0px", right: "0px"
                }} />
            </div>

            <Handle
                type="target"
                position="top"
                id="t"
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
                position="right"
                id="r"
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
            <div style={{
                textAlign: "center",
                background: data?.statusData['color'],
                borderRadius: "4px",
                padding: "4px"
            }}>
                {data?.statusData['status'] === "" ? "Empty" : data.statusData['status']}
            </div>

        </>
    );
});