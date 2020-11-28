import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import { useZoomPanHelper, useStoreState, useStoreActions } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import SplitButton from "monday-ui-react-core/dist/SplitButton.js";
import "monday-ui-react-core/dist/SplitButton.css";

let FindPriorityByGroupButton = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        console.log(store);
        return [store.nodes, store.width, store.height, store.transform];
    });

    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);

    const selectPriority = (priorityNode) => {
        setSelectedElements({ id: priorityNode.id, type: priorityNode.type });
    };

    // creates a set(no repeats) of the group names from the given nodes
    function getGroupNames() {
        let nameSet = new Set();
        nodes.forEach(function (node) {
            nameSet.add(node['data']['group']);
        });
        return nameSet;
    }

    // returns the node in the given group with the highest priority
    function FindPriorityByGroup(groupName) {
        var highestPriorityIndex = 0;
        var nodeCount = 0;
        nodes.forEach(function (node, i) {
            if (node['data']['outgoingNodes'].length > nodeCount && node['data']['group'] == groupName) {
                nodeCount = node['data']['outgoingNodes'].length;
                highestPriorityIndex = i;
            }
        });

        return nodes[highestPriorityIndex];
    }

    // returns an array of <Button> JSX to put in the <SplitButton>
    function getDropdownItems() {
        let dropdownItems = [];
        let groupNames = getGroupNames();

        groupNames.forEach(function (group) {
            let currItem = <ListItem style={{padding:'0px'}}>
                {<Button
                    size="sm"
                    kind={Button.kinds.TERTIARY}
                    //style={{ backgroundColor: 'white' }}
                    onClick={(e) => {
                        let priority = FindPriorityByGroup(group);
                        LerpToNode(priority, currTransform, width, height, transform);
                        //useStoreActions();
                        {selectPriority(priority)}
                    }}>
                    {group}

                </Button>}
            </ListItem>;

            dropdownItems.push(currItem);
        });

        return dropdownItems;
    }

    return (
        <div style={{ marginRight: "8px" }}>
            <SplitButton
                size={SplitButton.sizes.SMALL}
                //style={{ marginRight: "8px" }} this breaks the splitbutton so do not do it
                secondaryDialogContent={
                    <List 
                        style={{backgroundColor:'white', borderRadius: '4px', padding: '8px'}}
                    >
                        {getDropdownItems()}
                    </List>
                }
            >
                Find Priority By Group
            </SplitButton>
        </div>
    );
}

export { FindPriorityByGroupButton };
export default FindPriorityByGroupButton;