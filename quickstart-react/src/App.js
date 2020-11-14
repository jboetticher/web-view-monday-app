import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Card from "./components/Card.js";

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
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`,
        { variables: { boardIds: this.state.context.boardIds } }
      )
        .then(res => {
          this.setState({ boardData: res.data });
        });
    })

  }

  render() {
    return (
      <div
        className="App"
        style={{ background: (this.state.settings.background) }}>
        <Card content={JSON.stringify(this.state.boardData, null, 2)} />
        <Card content={"What's up bitches? You're gonna choke on this node graph."} />
        <Card content={"please help me"} />
        <p>
          dear lord above, i pray
      </p>

      </div >
    );
  }
}

export default App;
