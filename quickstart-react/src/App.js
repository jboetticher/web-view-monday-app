import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
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
  }

  render() {
    return (
      <div 
        className="App"
        style={{background: (this.state.settings.background)}}
      >
      <h3>
        What's up bitches? You're gonna choke on this node graph.
      </h3>

      <div> please help me </div>

      </div>
    );
  }
}

export default App;
