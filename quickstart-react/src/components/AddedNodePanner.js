import React, { useState } from "react";
import mondaySdk from "monday-sdk-js";

import { ReactFlowProvider } from 'react-flow-renderer';
import { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

//const monday = mondaySdk();

//let panner = props => {

//}

/*const selectPriority = (priorityNode) => {
    setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
};*/

class AddedNodePanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monday: props.monday
        }
            
    }



    componentDidMount() {
        this.state.monday.listen("events", (res) => {
            switch (res["type"]) {
                case "new_items":
                    this.panToNode();
                    break;
            }
        });
    }

    panToNode() {
        console.log("yay i added a node");

        /*const { transform } = useZoomPanHelper();
        var [nodes, width, height, currTransform] = useStoreState((store) => {
            return [store.nodes, store.width, store.height, store.transform];
        });

        const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

        LerpToNode(nodes[nodes.length - 1], currTransform, width, height, transform);*/
    }

    render() {
        return (
            <div></div>
        );
    }
}
export default AddedNodePanner;