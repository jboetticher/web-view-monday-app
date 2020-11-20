import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import mondaySdk from "monday-sdk-js";

class NodeFunctions {

    constructor(mondaySdk) {
        this.monday = mondaySdk;
    }

    /* Adds and saves connections between two nodes.
    * onConnectParams - the parameters that you get 
    */
    AddConnection(onConnectParams) {
        this.monday.storage.instance.setItem('mykey', 'Lorem Ipsum').then(res => {

            

            console.log(res);
        });
    }
}

export default NodeFunctions;