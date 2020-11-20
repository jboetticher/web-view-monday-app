import React from 'react';
import { getBezierPath } from 'react-flow-renderer';

export default ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    connectionLineType,
    connectionLineStyle,
}) => {

    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    //straight path
    //d={`M${sourceX},${sourceY} L ${targetX},${targetY}`}

    return (
        <g>
            <path
                fill="none"
                stroke="#fff"
                strokeWidth={5}
                className="animated"

                d={edgePath}

            />
            <circle cx={targetX} cy={targetY} fill="#0071d9" r={5} stroke="#fff" strokeWidth={1.5} />
        </g>
    );
};