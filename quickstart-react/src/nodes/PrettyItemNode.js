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
            style={{ left: "-10px", top: "-10px" }}
            onClick={() => {
                setCollapsed(!collapsed);
            }}
        >
            <ChevronUp className={"pos-absolute noClick"} style={chevronUpStyle} />
            <ChevronDown className={"pos-absolute noClick"} style={chevronDownStyle} />
        </Avatar>;

    // generates the divs for when it's collapsed and when it's not
    var notCollapsedData = collapsed ? <div /> :
        <div style={{ maxWidth: "300px" }}>
            <table>
                <tbody>
                    <tr>
                        <td>Group</td>
                        <td style={{ width: "16px" }} />
                        <td className={"centered-td"}>{data?.group}</td>
                    </tr>
                    {data?.columnValues.map((x, i) => {
                        switch (x['title']) {
                            case "Subitems":
                            case "Person":
                            case "Status":
                                return <tr key={i}></tr>;
                            default:
                                return (
                                    <tr key={i}>
                                        <td>{x['title']}</td>
                                        <td style={{ width: "16px" }} />
                                        <td className={"centered-td"}>
                                            {x['text'] === "" || x['text'] === null ? "- - -" : x['text']}
                                        </td>
                                    </tr>
                                );
                        }
                    })}
                </tbody>
            </table>

        </div>;

    //css styles for the handles (these are large and opacity 0)
    //determines the "hitbox" for the handles
    //currently the path connects into these hitboxes so it looks strange if it sticks out more than the fake dot            
    var targetStyle = { background: '#0071d9', width: '30%', height: '20px', borderRadius: '0%', top: '-5px', opacity: '0%' };
    var sourceStyleLeft = { background: 'var(--color-mud_black)', width: '20px', height: '30%', borderRadius: '0%', left: '-5px', opacity: '0%' };
    var sourceStyleRight = { background: 'var(--color-mud_black)', width: '20px', height: '30%', borderRadius: '0%', right: '-5px', opacity: '0%' };
    var sourceStyleBot = { background: 'var(--color-mud_black)', width: '30%', height: '20px', borderRadius: '0%', bottom: '-5px', opacity: '0%' };

    //these are the little handle dots (purely visual)
    var fakeTopHandle = <div className='react-flow__handle-top react-flow__handle' style={{ background: '#0071d9', width: '10px', height: '10px', top: '-5px' }}></div>;
    var fakeLeftHandle = <div className='react-flow__handle-left react-flow__handle' style={{ background: 'var(--color-mud_black)', width: '10px', height: '10px', left: '-5px' }}></div>;
    var fakeRightHandle = <div className='react-flow__handle-right react-flow__handle' style={{ background: 'var(--color-mud_black)', width: '10px', height: '10px', right: '-5px' }}></div>;
    var fakeBotHandle = <div className='react-flow__handle-bottom react-flow__handle' style={{ background: 'var(--color-mud_black)', width: '10px', height: '10px', bottom: '-5px' }}></div>;

    // change what the handles look like if it is in connecting mode
    // doesnt work so don't give up 
    /*if (data?.isConnecting) {
        targetStyle = { background: '#0071d9', width: '20px', height: '20px' };
    }
    else {
        targetStyle = { background: '#0071d9', width: '10px', height: '10px' };
    }*/

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
                <Chip 
                    size={"medium"}
                    label={data?.outgoingNodes.length}
                    style={{
                        position: "absolute",
                        right: "-8px", top: "-8px",
                        background: data?.groupColor
                    }}
                />
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
                style={sourceStyleBot}
            />
            <Handle
                type="source"
                position="right"
                id="r"
                style={sourceStyleRight}
            />
            <Handle
                type="source"
                position="left"
                id="l"
                style={sourceStyleLeft}
            />
            {fakeTopHandle}
            {fakeLeftHandle}
            {fakeRightHandle}
            {fakeBotHandle}

            <div style={{ maxWidth: "170px" }}>
                <h4>{data?.title}</h4>
            </div>
            {notCollapsedData}
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