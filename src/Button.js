import React, { Component } from "react";

class InputButton extends Component {
  constructor(props) {
    super(props);
    const nameMap = {
      R: "Right",
      L: "Left",
      B: "Back",
      F: "Forward",
      RUN: "Run"
    };
    this.name = nameMap[props.action];
  }
  render() {
    return (
      <button
        className="input"
        disabled={this.props.disabled || false}
        onClick={() => {
          this.props.onClick(this.props.action);
        }}
      >
        {this.name}
      </button>
    );
  }
}

export default InputButton;