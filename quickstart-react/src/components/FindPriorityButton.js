import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import { useZoomPanHelper, useStoreState } from 'react-flow-renderer';

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

    function lerp(start, end, time) {
        return start * (1 - time) + end * time;
    }

    return (
        <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                let priority = FindPriority();
                let time = 0;

                /*
                //loop through the html of the nodes
                var desiredNode = null;
                let htmlNodes = document.getElementsByClassName("react-flow__node");
                console.log(htmlNodes);
                for (var i = 0; i < htmlNodes.length; i++) {

                    console.log("broof");
                    //get id of the node from the class name
                    let htmlNodeId = htmlNodes[i].classList[2];

                    if (htmlNodeId == priority.id) {
                        desiredNode = htmlNodes[i];
                        console.log("bruh", htmlNodes[i]);
                        break;
                    }
                }
                */

                let [currX, currY] = [currTransform[0], currTransform[1]];
                let x = -priority.position.x + width / 2 - 85;
                let y = -priority.position.y + height / 2 - 63;

                const panner = setInterval(() => {
                    var repos = {
                        x: lerp(currX, x, time),
                        y: lerp(currY, y, time),
                        zoom: 1
                    };

                    transform(repos);
                    time += 0.05;

                    if (time >= 1) clearInterval(panner);
                }, 10);
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;