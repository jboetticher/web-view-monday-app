import React, {useState} from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";

import ReactFlow, { removeElements, addEdge } from 'react-flow-renderer';
import ItemNode from "./nodes/ItemNode.js";
import PrettyItemNode from "./nodes/PrettyItemNode.js";
import "./css/node-view.css";

import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import UIOverlay from "./components/UIOverlay";

import ReactFlowChart from "./ReactFlowChart.js";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  // use to communicate with event listeners
  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });

    monday.listen("context", res => {
      this.setState({ context: res.data });

      // board info query
      monday.api(`query ($boardIds: [Int]) 
      { 
        boards (ids:$boardIds) { 
          name 
          items { id name group {title color} column_values { title text } } 
          columns {
            title
            settings_str
          }
        } 
      }`,
        { variables: { boardIds: this.state.context.boardIds } }
      ).then(res => {
        this.setState({ boardData: res.data });
        //console.log(res);
      });

      //console.log(this.state.context);
    });

    monday.listen("itemIds", (res) => {
      this.setState({ filteredItems: res.data });
    });
  }

  render() {

    // determines the color of a node
    var statusColors = null;
    function statusColor(itemColumnValues, boardColumnData) {

      // retrieves the status colors if not done already
      if (statusColors == null) {

        var statusSettings = "pog";
        boardColumnData?.forEach(function (column, cIndex) {
          if (column['title'] == "Status") {
            statusSettings = column['settings_str'];
          }
        });

        statusColors = {};
        var statusInfoJson = JSON.parse(statusSettings);
        Object.entries(statusInfoJson['labels']).forEach(function (labelData) {
          var localID = labelData[0];
          var name = labelData[1];
          statusColors[name] = statusInfoJson['labels_colors'][localID]['color'];
        });
      }

      // gets the status from the column values
      var status = "";
      itemColumnValues?.forEach(function (column, cIndex) {
        if (column['title'] === "Status") {
          status = column['text'];
        }
      });

      // returns the right color css
      if (status in statusColors) return { status: status, color: statusColors[status] };
      else { return { status: "", color: "var(--color-ui_grey)" }; }
    }

    // what to do when the user clicks on an element
    function onElementClick(event, element) {
      if (typeof (element) === typeof (PrettyItemNode)) {
        // monday.com FUCKING SUCKS BECAUSE THEIR API IS FUCKING BROKEN SINCE AUGUST AND THIS DOESN'T FUCKING WORK
        //monday.execute('openItemCard', { itemId: element["id"], kind: 'columns' });

        monday.execute('openItemCard', { itemId: element["id"], kind: 'updates' });
      }
      else {
        alert("OH");
      }
    }

    // returns the right color based on the current filter
    function nodeColorOnFilter(filteredData, itemId) {

      if (filteredData == null) return "var(--color-snow_white)";

      var colorString = "var(--color-jarco_gray)";
      Object.entries(filteredData).forEach(function (num, numIndex) {
        console.log("suggestion for " + itemId + ": " + num[1]);
        if (itemId == num[1]) { 
          colorString = "var(--color-snow_white)"; 
          console.log("Holy smokes, you did it! they're equal! now colorstring: " + colorString);
        }
      });

      return colorString;
    }

    // pass in the item and the board it is in, alogn with all the boardData
    // returns an array that holds all the data about the subitems of an item
    /* CURRENTLY UNABLE TO WORK DUE TO CONSTRAINTS WITH MONDAY API AND SUBITEMS */
    /*function getSubitems(boardData, board, parentItem){
      let subitemArray = [];

      let subitemBoard;
      boardData.forEach(function(board){
        if (board['name'] == "Subitems of " + board['name']){
          subitemBoard = board;
        }
      });

      let parentSubitemText = parentItem['column_values'][0]['text'];
      subitemBoard.forEach(function(subitem){
        
        //if the parent subitem text contains the name of the subitem,
        //then that subitem in the pool is a subitem of our parent
        if (parentSubitemText.indexOf(subitem['name']) > 0){
          subitemArray.push(subitem);
        }
      });

      return subitemArray;
    }*/

    const nodeTypes = {
      itmNode: ItemNode,
      prettyNode: PrettyItemNode
    };

    // Only execute once board data has loaded
    if (this.state.boardData != null) {

      //bdata is the array monday passed us with all the data
      var bdata = this.state.boardData.boards;

      //the items that should be highlighted by the filter
      var filteredItems = this.state.filteredItems;

      console.log("-----------------------");
      console.log(this.state.boardData.boards);
      console.log("-----------------------");

      // retrieves column data FOR JUST THE FIRST BOARD
      var columnData = bdata[0]['columns'];
      var boardElements = [];

      //Goes into each board element in the JSON data array
      bdata.forEach(function (board, bIndex) {
        if (board['name'].indexOf("Subitems of") == 1) return;
        var previousNodeId = -1;
        var previousGroupName = "";

        // Adds an id number & index to the group ids
        let groupIds = {};
        let groupIndex = {};
        let currentGroupId = 0;
        board['items'].forEach(function (item, itIndex) {
          let groupName = item['group']['title'];
          if (!(groupName in groupIds)) {
            groupIds[groupName] = currentGroupId;
            groupIndex[groupName] = 0;
            currentGroupId++;
          }
        });

        //Goes into each item element in the JSON data
        board['items'].forEach(function (item, itIndex) {

          let groupName = item['group']['title'];
          let titleName = item['name'];
          let nodeBackgroundColor = nodeColorOnFilter(filteredItems, item['id']);

          // gets status data
          let statusData = statusColor(item['column_values'], columnData);

          // gets subitems if the item has subitems
          // item['column_values'][0]['text'] provides a text of the subitems
          // if no subitems, value will be empty string
          if (item['column_values'][0] != "") {
            let subitems = item['column_values'][0]['text'];
            //console.log(subitems);
          }


          // adds a node
          boardElements.push(
            {
              id: item['id'],
              type: "prettyNode",
              data: {
                title: titleName,
                group: groupName, groupColor: item['group']['color'],
                statusData: statusData
              },
              style: {
                padding: "16px",
                borderRadius: "8px", //border: "4px solid", borderColor: item['group']['color'],
                background: nodeBackgroundColor, //item['group']['color']
                boxShadow: "0px 6px 20px -2px rgba(0, 0, 0, 0.2)"
              },
              position: { x: 250 * groupIds[groupName] + bIndex * 1000, y: 250 * groupIndex[groupName] }
            }
          );

          // increments group index
          groupIndex[groupName] += 1;

          // adds an animated connector to the next one if in same group
          if (previousNodeId > 0 && previousGroupName == groupName) {
            boardElements.push(
              {
                id: 'e' + previousNodeId + '-' + item['id'],
                source: previousNodeId,
                target: item['id'],
                animated: true
              }
            )
          }

          previousNodeId = item['id'];
          previousGroupName = groupName;
        });
      });
    }


    // note: adding a background threw a shit ton of errors for some reason whoops
    return (
      <div
        className="App"
        style={{ display: "block", background: "var(--color-mud_black)" }}//(this.state.settings.background) }}
      >
       
       <ReactFlowChart 
          boardElements={boardElements}
          nodeTypes={nodeTypes}
          onElementClick={onElementClick}
       />

        <UIOverlay>
          <div style={{
            width: "100px", height: "100px",
            bottom: "0px", left: "0px"
          }}>
            <a href="https://pisslake.github.io/">
              <Button>Pisslake</Button>
            </a>
          </div>
        </UIOverlay>
      </div >
    );
  }
}

export default App;
