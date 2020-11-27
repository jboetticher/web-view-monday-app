import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import { useZoomPanHelper, useStoreState } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

let FindPriorityButton = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        return [store.nodes, store.width, store.height, store.transform];
    });

    function FindPriority() {
        var highestPriorityIndex = 0;
        var nodeCount = 0;
        Object.entries(nodes).forEach(function (node, i) {
            if (node[1].data.outgoingNodes.length > nodeCount) {
                nodeCount = node[1].data.outgoingNodes.length;
                highestPriorityIndex = i;
            }
        });

        return nodes[highestPriorityIndex];
    }

    return (
        <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                let priority = FindPriority();
                LerpToNode(priority, currTransform, width, height, transform);
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;