import React, { useEffect, useState, useRef } from "react";
import { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

let AddedNodePanner = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        return [store.nodes, store.width, store.height, store.transform];
    });

    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const selectPriority = (priorityNode) => {
        setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
    };

    useEffect(() => {
        //console.log("bro im panning here", nodes);
        //console.log("these be our props in the panner", props);
        if (nodes.length !== 0) {
            panToNode(props.addedNode);
        }
    }, [props.addedNode]);

    function panToNode(node) {
        //console.log("i am now going to pan to the node guys");
        LerpToNode(node, currTransform, width, height, transform);
        selectPriority(node);
    }

    return (
        <div></div>
    );
}

export { AddedNodePanner };
export default AddedNodePanner;
