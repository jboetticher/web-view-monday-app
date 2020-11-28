import React, { useState } from "react";
import mondaySdk from "monday-sdk-js";

import { ReactFlowProvider } from 'react-flow-renderer';
import { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

const mondaysdk = mondaySdk();

class AddedNodePanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monday: props?.monday
        }

    }



    componentDidMount() {
       mondaysdk.listen("events", (res) => {
            switch (res["type"]) {
                case "new_items":
                    //panToNode();
                    break;
            }
        });
    }

    //panToNode() {
    //    console.log("yay i added a node");
    //}

    render() {
        return (
            <Panner>
            </Panner>
        );
    }
}
export default AddedNodePanner;

let Panner = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        return [store.nodes, store.width, store.height, store.transform];
    });

    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const selectPriority = (priorityNode) => {
        setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
    };

    function panToNode() {
        //let priority = FindPriority();
        LerpToNode(nodes[nodes.length-1], currTransform, width, height, transform);
        selectPriority(nodes[nodes.length-1]);
    }

    return (
        <div></div>
    );
}

export { Panner };
