import React, {useState} from "react";
import ReactFlow, { removeElements, addEdge } from 'react-flow-renderer';

let ReactFlowChart = props => {

	const [elements, setElements] = useState(props?.boardElements);
    const onConnect = (params) => {
      //console.log('on connect', params);
      setElements((els) => addEdge(params, els));
    };
	
	return( 

		<ReactFlow
          elements={props?.boardElements}
          nodeTypes={props?.nodeTypes}
          onElementClick={props?.onElementClick}
          onConnect={onConnect}
        >
        </ReactFlow>

    );
}

export default ReactFlowChart;