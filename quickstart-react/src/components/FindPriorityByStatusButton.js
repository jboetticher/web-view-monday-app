import React from 'react';
import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import { useZoomPanHelper, useStoreState } from 'react-flow-renderer';
import { LerpToNode } from "./LerpyDerpy.js";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import SplitButton from "monday-ui-react-core/dist/SplitButton.js";
import "monday-ui-react-core/dist/SplitButton.css";

let FindPriorityByStatusButton = props => {

    const { transform } = useZoomPanHelper();
    let [nodes, width, height, currTransform] = useStoreState((store) => {
        return [store.nodes, store.width, store.height, store.transform];
    });

    // creates a set(no repeats) of the group names from the given nodes
    function getStatusNames() {
        let nameSet = new Set();
        nodes.forEach(function (node) {
            if(node['data']['statusData']['status'] == ""){
                nameSet.add("Empty");
            } 
            else {
                nameSet.add(node['data']['statusData']['status']);
            }    
        });
        return nameSet;
    }

    // returns the node in the given group with the highest priority
    function FindPriorityByStatus(statusName) {
        var highestPriorityIndex = 0;
        var nodeCount = 0;
        nodes.forEach(function (node, i) {
            if (node['data']['outgoingNodes'].length > nodeCount) {
                if(statusName == "Empty" && node['data']['statusData']['status'] == ""){
                    nodeCount = node['data']['outgoingNodes'].length;
                    highestPriorityIndex = i;
                }
                else if(node['data']['statusData']['status'] == statusName){
                    nodeCount = node['data']['outgoingNodes'].length;
                    highestPriorityIndex = i;   
                }
                
            }
        });

        return nodes[highestPriorityIndex];
    }

    // returns an array of <Button> JSX to put in the <SplitButton>
    function getDropdownItems() {
        let dropdownItems = [];
        let statusNames = getStatusNames();

        statusNames.forEach(function (status) {
            let currItem = <ListItem style={{padding:'0px'}}>
                {<Button
                    size="sm"
                    kind={Button.kinds.TERTIARY}
                    //style={{ backgroundColor: 'white' }}
                    onClick={(e) => {
                        let priority = FindPriorityByStatus(status);
                        LerpToNode(priority, currTransform, width, height, transform);
                        //console.log("LOOK AT THE DATATA", this.nodes);
                    }}>
                    {status}

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
                Find Priority By Status
            </SplitButton>
        </div>
    );
}

export { FindPriorityByStatusButton };
export default FindPriorityByStatusButton;