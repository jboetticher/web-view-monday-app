import React, { useState } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";

import { removeElements, addEdge, Controls } from 'react-flow-renderer';
import ItemNode from "./nodes/ItemNode.js";
import PrettyItemNode from "./nodes/PrettyItemNode.js";
import NodeFunctions from "./nodes/NodeFunctions.js";
import "./css/node-view.css";

import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";
import UIOverlay from "./components/UIOverlay";

import ReactFlowChart from "./ReactFlowChart.js";

const monday = mondaySdk();
const nodeHelper = new NodeFunctions(monday);

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
      });

      //console.log(this.state.context);
    });

    monday.listen("itemIds", (res) => {
      this.setState({ filteredItems: res.data });
    });

    monday.listen("events", (res) => {
      switch (res["type"]) {
        case "new_items":
          alert("NEW ITEM BRUH");
          break;
        case "change_column_value":
          break;
      }
    });
  }

  render() {

    // what to do when the user clicks on an element
    function onElementClick(event, element) {

      // checks for ignore node click
      if (event == null) { return; }
      if(nodeHelper.EventHasClass(event, "ignore-node-on-click")) {
        console.log("Click detected, but ignoring.");
        return;
      }
      /*
      var classList = Object.entries(event["path"][0]['classList']);
      for (var i = 0; i < classList.length; i++) {
        if (classList[i][1] === "ignore-node-on-click") {
          console.log("Click detected, but ignoring.");
          return;
        }
      }*/

      // only do node actions if it's our node
      if (typeof (element) === typeof (PrettyItemNode)) {
        // monday.com FUCKING SUCKS BECAUSE THEIR API IS FUCKING BROKEN SINCE AUGUST AND THIS DOESN'T FUCKING WORK
        //monday.execute('openItemCard', { itemId: element["id"], kind: 'columns' });

        monday.execute('openItemCard', { itemId: element["id"], kind: 'updates' });
      }
      else {
        alert("OH");
      }
    }

    // note: adding a background threw a shit ton of errors for some reason whoops
    return (
      <div
        className="App"
        style={{ display: "block", background: "var(--color-mud_black)" }}//(this.state.settings.background) }}
      >

        <ReactFlowChart
          boardData={this.state.boardData?.boards}
          filteredItems={this.state?.filteredItems}
          onElementClick={onElementClick}
          pathSettings={this.state.settings?.pathdisplay}
          backgroundSettings={this.state.settings?.backgroundType}
          nodeHelper={nodeHelper}
        //boardElements={boardElements}
        //nodeTypes={nodeTypes}
        />

        <UIOverlay>
          <a href="https://pisslake.github.io/" style={{ marginRight: "8px" }}>
            <Button>Pisslake</Button>
          </a>
          <Button onClick={() => {

          }}
            style={{ marginRight: "8px" }}>
            Recenter
          </Button>
          <Button onClick={() => {
            monday.execute("confirm", {
              message: "Are you sure you want to reset the nodes? " +
                "You will lose all of the connections that you have made, and all of the original connections will be returned.",
              confirmButton: "Confirm",
              cancelButton: "Cancel",
              excludeCancelButton: false
            }).then((res) => {
              if (res.data["confirm"] === true) {
                // do the reset here
              }
            });
          }}
            style={{ marginRight: "8px" }}>
            Reset
          </Button>
        </UIOverlay>
      </div >
    );
  }
}

export default App;
