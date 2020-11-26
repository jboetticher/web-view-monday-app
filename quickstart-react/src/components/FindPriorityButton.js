import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import ReactFlow, { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';

let FindPriorityButton = props => {

    const { transform } = useZoomPanHelper();
    const [nodes] = useStoreState((store) => store.nodes);

    function FindPriority() {

    }

    return (
        <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                transform({x: 100, y: 200, zoom: 1});
                console.log(nodes);
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;