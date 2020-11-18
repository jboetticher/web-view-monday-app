import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";

import ItemNode from "./nodes/ItemNode.js";
import PrettyNode from "./nodes/PrettyItemNode.js"

import ReactFlow from 'react-flow-renderer';

import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import PrettyItemNode from "./nodes/PrettyItemNode.js";

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
        console.log(res);
      });

      console.log(this.state.context);
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
      else { return { status: "", color: "var(--color-ui_grey)"}; }
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


    const nodeTypes = {
      itmNode: ItemNode,
      prettyNode: PrettyNode
    };

    const elements = [
      { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
      // you can also pass a React component as a label
      { id: '2', data: { label: 'node 2' }, position: { x: 100, y: 100 } },
      {
        id: '3',
        type: 'itmNode',
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 300, y: 50 },
      },
      {
        id: '4', type: "prettyNode", data: { label: 'Pretty Node' }, position: { x: 150, y: 150 },
        style: { padding: "16px", borderRadius: "8px", background: "var(--color-egg_yolk)", maxWidth: "200px" }
      },
      { id: 'e1-2', source: '1', target: '2', animated: true },
    ];

    // Only execute once board data has loaded
    if (this.state.boardData != null) {

      //converts strange JSON data into usable array
      var bdata = Object.entries(this.state.boardData);

      // retrieves column data FOR JUST THE FIRST BOARD
      var columnData = bdata[0][1][0]['columns'];
      var boardElements = [];


      //Goes into each board element in the JSON data
      //bdata[0][1] is where the list of boards are after the Object.entries conversion
      bdata[0][1].forEach(function (board, bIndex) {

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

          // gets status data
          let statusData = statusColor(item['column_values'], columnData);

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
                background: "#ddd" //item['group']['color']
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
        style={{ display: "block", background: (this.state.settings.background) }}
      >

        <ReactFlow
          elements={boardElements}
          nodeTypes={nodeTypes}
          onElementClick={onElementClick}
        >

        </ReactFlow>
      </div >
    );
  }
}

export default App;
