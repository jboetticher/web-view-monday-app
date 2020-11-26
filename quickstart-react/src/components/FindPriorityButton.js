import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import ReactFlow, { useZoomPanHelper } from 'react-flow-renderer';

let FindPriorityButton = props => {

    const { zoomOut } = useZoomPanHelper();

    return (
        <Button
            size="small"
            style={{ marginRight: "8px" }}
            onClick={(e) => {
                zoomOut();
            }}>
            Find Priority
        </Button>
    );
}

export { FindPriorityButton };
export default FindPriorityButton;