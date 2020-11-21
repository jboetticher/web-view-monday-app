import React, { memo, useState } from 'react';
import { Handle } from 'react-flow-renderer';
import ChevronDown from "monday-ui-react-core/dist/icons/DropdownChevronDown";
import ChevronUp from "monday-ui-react-core/dist/icons/DropdownChevronUp";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

// todo: make color of node change based on whether or not it's finished
// todo: make the color of the dependent nodes change based on whether or not it's finished


export default memo(({ data }) => {

    // collapsed vs not collapsed
    let [collapsed, setCollapsed] = useState(true);
    var chevronDownStyle = collapsed ? { bottom: '-2px' } : { top: '-2px' };
    var chevronUpStyle = collapsed ? { top: '-2px' } : { bottom: '-2px' };
    var collapseButtonChip =
        <Avatar className={"small-avatar pos-absolute collapse-chip ignore-node-on-click"}
            style={{ left: "-10px", top: "-10px"}}
            onClick={() => {
                setCollapsed(!collapsed);
            }}
        >
            <ChevronUp className={"pos-absolute noClick"} style={chevronUpStyle} />
            <ChevronDown className={"pos-absolute noClick"} style={chevronDownStyle} />
        </Avatar>;
    var notCollapsedData = collapsed ? <div/> :
        <div>
            Group: {data?.group}
        </div>;


    // change what the handles look like if it is in connecting mode
    // doesnt work so don't give up 
    var targetStyle = { background: '#0071d9', width: '10px', height: '10px' };
    var sourceStyle = { background: 'var(--color-mud_black)', width: '10px', height: '10px' };
    if (data?.isConnecting) {
        targetStyle = { background: '#0071d9', width: '20px', height: '20px' };
        //console.log("handle style changed");
    }
    else {
        targetStyle = { background: '#0071d9', width: '10px', height: '10px' };
        //console.log("default handle style");
    }


    return (
        <>
            <div style={{
                position: "fixed",
                background: data?.groupColor,
                height: "16px",
                borderRadius: "8px",
                top: "0px", left: "0px", right: "0px",
            }}>
                <div style={{
                    position: "absolute",
                    background: data?.groupColor,
                    height: "8px",
                    bottom: "0px", left: "0px", right: "0px"
                }} />
                {collapseButtonChip}
            </div>

            <Handle
                type="target"
                position="top"
                id="t"
                style={targetStyle}
            />
            <Handle
                type="source"
                position="bottom"
                id="b"
                style={sourceStyle}
            />
            <Handle
                type="source"
                position="right"
                id="r"
                style={sourceStyle}
            />
            <Handle
                type="source"
                position="left"
                id="l"
                style={sourceStyle}
            />

            <div style={{ maxWidth: "170px" }}>
                <h4>{data?.title}</h4>
                {notCollapsedData}
            </div>
            <div style={{
                textAlign: "center",
                background: data?.statusData['color'],
                borderRadius: "4px",
                padding: "4px",
                marginTop: "8px"
            }}>
                {data?.statusData['status'] === "" ? "Empty" : data.statusData['status']}
            </div>

        </>
    );
});