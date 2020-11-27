import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import mondaySdk from "monday-sdk-js";

class NodeFunctions {

    constructor(mondaySdk) {
        this.monday = mondaySdk;

        // querying now happens in app.js

        // Querying from monday.com
        //this.QueryConnections();
        //this.QueryPositions();
    }

    EventHasClass(event, className) {
        if (event["path"] == null) { return false; }
        var classList = Object.entries(event["path"][0]['classList']);
        for (var i = 0; i < classList.length; i++) {
            if (classList[i][1] === className) {
                return true;
            }
        }

        return false;
    }

    //#region Connections

    /* Queries the connection data from monday.com.
     */
    QueryConnections() {
        this.monday.storage.instance.getItem('connection_objects').then(res => {
            this.SetConnections(res);
        });
    }

    SetConnections(res) {
        console.log(res);

        if (res.data.value !== null) {
            this.connections = JSON.parse(res.data.value);
            console.log(this.connections);
        }
        else {
            this.connections = [];
            console.log(this.connections);
        }
    }

    //returns the promise object
    QueryConnectionsPromise() {
        return this.monday.storage.instance.getItem('connection_objects');
    }

    //returns the promise object
    QueryPositionsPromise() {
        return this.monday.storage.instance.getItem('node_positions');
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
                this.connections[i].target == onConnectParams.target &&
                this.connections[i].sourceHandle == onConnectParams.sourceHandle) {
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

    /* Removes a single connection between two nodes from monday.com
     * sourceId - the id of the source node
     * targetId - the id of the target node
     * sourceHandleId - the handle id of the source node
     */
    RemoveConnection(sourceId, targetId, sourceHandleId) {
        // checks to see if the current array has one of those connections
        var replaceIndex = -1;
        for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].source == sourceId &&
                this.connections[i].target == targetId &&
                this.connections[i].sourceHandle == sourceHandleId) {
                replaceIndex = i;
                console.log("REMOVING FROM DATABASE", this.connections[i]);
                break;
            }
        }

        // if the index isn't negative then it deletes
        if (replaceIndex >= 0) {
            // splices the target that was removed
            console.log("BEFORE REMOVAL:", this.connections);
            this.connections.splice(i, 1);
            console.log("AFTER REMOVAL:", this.connections);
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

    /* Removes an array of connections from monday.com
     * conArray - array of connections/edges to be removed
     */
    RemoveConnections(conArray) {
        //console.log("REMOVING THESE CONNECTIONS", conArray);
        // loop through all connections to be deleted
        for (var c = 0; c < conArray.length; c++) {
            // checks to see if the current array has one of those connections
            var replaceIndex = -1;
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].source == conArray[c]['source'] &&
                    this.connections[i].target == conArray[c]['target'] &&
                    this.connections[i].sourceHandle == conArray[c]['sourceHandle']) {
                    replaceIndex = i;
                    console.log("REMOVING FROM DATABASE", this.connections[i]);
                    break;
                }
            }

            // if the index isn't negative then it deletes
            if (replaceIndex >= 0) {
                // splices the target that was removed
                console.log("BEFORE REMOVAL:", this.connections);
                this.connections.splice(i, 1);
                console.log("AFTER REMOVAL:", this.connections);
            }
        }

        // json stringify the current connections
        const jsonString = JSON.stringify(this.connections);

        // save to monday.com persist as one call
        this.monday.storage.instance.setItem('connection_objects', jsonString).then(res => {
            console.log(res);
            console.log(jsonString);

            this.QueryConnections();
        });
    }

    //#endregion

    //#region Positions

    /* Queries the position data from monday.com.
     */
    QueryPositions() {
        this.monday.storage.instance.getItem('node_positions').then(res => {
            this.SetPositions(res);
        });
    }

    SetPositions(res) {
        console.log(res);

        if (res.data.value !== null) {
            this.positions = JSON.parse(res.data.value);
            console.log(this.positions);
        }
        else {
            this.positions = [];
            console.log(this.positions);
        }
    }

    /* Returns the position data from monday.com in a object format.
     */
    GetPositions() {
        return this.positions;
    }

    /* 
    * Adds and saves connections between two nodes.
    * onConnectParams - the parameters that you get when a connection is made
    */
    AddPosition(onNodeDragStopParams) {

        // if it's null we ain't messing with it
        if (onNodeDragStopParams == null) { return; }
        console.log("saving positions ", onNodeDragStopParams);

        // checks to see if the current array has any of those positions
        var replaceIndex = -1;
        for (var i = 0; i < this.positions.length; i++) {
            if (this.positions[i].id == onNodeDragStopParams.id) {
                replaceIndex = i;
                break;
            }
        }

        // add or replace to the current array of positions 
        if (replaceIndex < 0) {
            this.positions.push({
                "id": onNodeDragStopParams.id,
                "position": onNodeDragStopParams.position
            });
        }
        else {
            this.positions[i].position = onNodeDragStopParams.position;
        }

        // json stringify the current connections
        const jsonString = JSON.stringify(this.positions);

        // save to monday.com persist
        this.monday.storage.instance.setItem('node_positions', jsonString).then(res => {
            console.log(res);
            console.log(jsonString);

            this.QueryPositions();
        });
    }

    //#endregion

    //#region Database Manipulation

    DeleteItem(itemId, callback) {
        console.log(typeof (itemId));
        console.log(itemId);
        // delete item query
        this.monday.api(`mutation ($itemId: Int) 
        { 
            delete_item (item_id: $itemId) { id } 
        }`,
            { variables: { itemId: parseInt(itemId) } }
        ).then(res => {
            callback();
            //this.setState({ boardData: res.data });
        });

        // finds all of the edges and tries to de
    }

    ResetData() {
        this.monday.storage.instance.setItem('node_positions', "").then(res => {
            this.positions = [];
        });

        this.monday.storage.instance.setItem('connection_objects', "").then(res => {
            this.connections = [];
        });
    }

    //#endregion
}

export default NodeFunctions;