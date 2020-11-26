import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import ReactFlow, { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';

let FindPriorityButton = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height] = useStoreState((store) => {
        return [store.nodes, store.width, store.height];
    } );

    function FindPriority() {
        var highestPriorityIndex = 0;
        var nodeCount = 0;
        Object.entries(nodes).forEach(function(node, i) {
            if(node[1].data.outgoingNodes.length > nodeCount) {
                nodeCount = node[1].data.outgoingNodes.length;
                highestPriorityIndex = i;
            }
        });

        console.log(nodes[highestPriorityIndex]);
        return nodes[highestPriorityIndex];
    }

    return (
        <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                var priority = FindPriority();
                var repos = {
                    x: -priority.position.x, //+ width / 2, 
                    y: -priority.position.y, //+ height / 2, 
                    zoom: 1};
                transform(repos);
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;