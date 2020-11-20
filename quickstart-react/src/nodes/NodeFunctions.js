import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import mondaySdk from "monday-sdk-js";

class NodeFunctions {

    constructor(mondaySdk) {
        this.monday = mondaySdk;
        this.QueryConnections();
    }

    /* Queries the connection data from monday.com.
     */
    QueryConnections() {
        this.monday.storage.instance.getItem('connection_objects').then(res => {
            console.log(res);
            
            if (res.data.value !== null) {
                this.connections = JSON.parse(res.data.value);
                console.log(this.connections);
            }
            else {
                this.connections = [];
                console.log(this.connections);
            }
        });
    }

    /* Returns the connection data from monday.com in a object format.
     */
    GetConnections() {
        return this.connections;
    }

    /* 
    * Adds and saves connections between two nodes.
    * onConnectParams - the parameters that you get when a connection is made
    */
    AddConnection(onConnectParams) {

        // if it's null we ain't messing with it
        if (onConnectParams == null) { return; }
        console.log("saving connections ", onConnectParams);

        // checks to see if the current array has any of those connections
        var replaceIndex = -1;
        for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].source == onConnectParams.source &&
                this.connections[i].target == onConnectParams.target) {
                replaceIndex = i;
                break;
            }
        }

        // add or replace to the current array of connections 
        if (replaceIndex < 0) {
            this.connections.push(onConnectParams);
        }
        else {
            this.connections[i] = onConnectParams;
        }

        // json stringify the current connections
        const jsonString = JSON.stringify(this.connections);

        // save to monday.com persist
        this.monday.storage.instance.setItem('connection_objects', jsonString).then(res => {
            console.log(res);
            console.log(jsonString);

            this.QueryConnections();
        });
    }
}

export default NodeFunctions;