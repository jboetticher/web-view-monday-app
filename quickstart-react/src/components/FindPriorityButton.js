import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

let FindPriorityButton = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        return [store.nodes, store.width, store.height, store.transform];
    });

    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const selectPriority = (priorityNode) => {
        setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
    };

    var groupNames = function(){
        let nameSet = Set();
        nodes.forEach(function(node){  
            nameSet.add(node['data']['group']);
        });
        return nameSet;
    }

    function FindPriority() {
        var highestPriorityIndex = 0;
        var nodeCount = 0;
        nodes.forEach(function (node, i) {
            if (node['data']['outgoingNodes'].length > nodeCount) {
                nodeCount = node['data']['outgoingNodes'].length;
                highestPriorityIndex = i;
            }
        });

        return nodes[highestPriorityIndex];
    }

    return (
        <Button
            size="sm"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                let priority = FindPriority();
                LerpToNode(priority, currTransform, width, height, transform);
                {selectPriority(priority)}
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;