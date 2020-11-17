import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Card from "./components/Card.js";

import ItemNode from "./nodes/ItemNode.js";
import PrettyNode from "./nodes/PrettyNode_proto.js"

import ReactFlow from 'react-flow-renderer';

import Button from "monday-ui-react-core/dist/Button.js";
import "monday-ui-react-core/dist/Button.css";

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
      console.log(res.data);
      /*monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items { name column_values { title text } } } }`,*/
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items { id name group {title} column_values { title text } } } }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          this.setState({ boardData: res.data });
        });
    })

  }


  render() {

    const nodeTypes = {
      itmNode: ItemNode,
      prettyNode: PrettyNode
    };

    const elements = [
      { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
      // you can also pass a React component as a label
      { id: '2', data: { label: 'node 2'}, position: { x: 100, y: 100 } },
      { id: '3',
        type: 'itmNode',
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 300, y: 50 },
      },
      {
        id: '4', type: "prettyNode", data: { label: 'Pretty Node' }, position: { x: 150, y: 150 } ,
        style: { padding:"16px", borderRadius:"8px", background:"var(--color-egg_yolk)", maxWidth:"200px" }
      },
      { id: 'e1-2', source: '1', target: '2', animated: true },
    ];

    // Only execute once board data has loaded
    if (this.state.boardData != null){

      //converts strange JSON data into usable array
      var bdata = Object.entries(this.state.boardData);

      console.log(bdata);
      var boardElements = [];

      //console.log(bdata[0][1]);

      //Goes into each board element in the JSON data
      //bdata[0][1] is where the list of boards are after the Object.entries conversion
      bdata[0][1].forEach(function(board, bIndex){    
        //Goes into each item element in the JSON data
        board['items'].forEach(function(item, itIndex){
          let labelName = item['group']['title'] + '>' + item['name'];
          boardElements.push({id: item['id'], data: { label: labelName }, position: {x: 200*bIndex, y: 100*itIndex} });

        });
        
      });
      //console.log(boardElements);
    } 
    


    return (
      <div
        className="App"
        style={{ display: "block", background: (this.state.settings.background) }}
      >

        <ReactFlow elements={boardElements} nodeTypes={nodeTypes}/>
      </div >
    );
  }
}

export default App;
