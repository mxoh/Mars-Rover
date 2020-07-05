import React, { Component } from "react";

import "./Rover.css";

import Board from "./Board";
import Button from "./Button";

const roverTurnOptions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function calculateMove(move, bordDim) {
  return ((move % bordDim) + bordDim) % bordDim;
}

class Rover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputString: "",
      history: [
        {
          move: null,
          position: props.start,
          direction: 0
        }
      ],
      stepNumber: 0
    };
  }

  queueMove(i) {
    this.setState({
      inputString: this.state.inputString.concat(i)
    });
  }

  checkForMove() {
    return this.state.history.length <= this.state.inputString.length;
  }

  executeNextMove() {
    if (this.checkForMove()) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.move(this.state.inputString[this.state.stepNumber++]);
    } else {
      clearInterval(this.state.intervalId);
    }
  }

  move(move) {
    const history = this.state.history;
    const currentState = history[history.length - 1];

    if (move === "F" || move === "B") {
      var moveDir = move === "F" ? [1, 1] : [-1, -1];
      var props = this.props;

      const pos = currentState.position.map(function(p, idx) {
        return calculateMove(
          p + roverTurnOptions[currentState.direction][idx] * moveDir[idx],
          props.dimensions[idx]
        );
      });

      this.setState({
        history: history.concat([
          {
            move: move,
            position: pos,
            direction: currentState.direction
          }
        ])
      });
    } else if (move === "L" || move === "R") {
      let newDirection = calculateMove(
        currentState.direction + (move === "R" ? 1 : -1),
        4
      );
      this.setState({
        history: history.concat([
          {
            move: move,
            position: currentState.position,
            direction: newDirection
          }
        ])
      });
    }
  }

  goto(step) {
    this.setState({
      stepNumber: step
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    return (
      <div className="container">
        <div className="board">
          <Board
            dimensions={this.props.dimensions}
            position={current.position}
            direction={current.direction}
          />
        </div>
        <div className="controls">
          {<div>Commands: {this.state.inputString}</div>}

          <Button action="L" onClick={i => this.queueMove(i)} />
          <Button action="R" onClick={i => this.queueMove(i)} />
          <Button action="F" onClick={i => this.queueMove(i)} />
          <Button action="B" onClick={i => this.queueMove(i)} />

          <Button
            action="RUN"
            disabled={!this.checkForMove()}
            onClick={() => this.executeNextMove()}
          />
        </div>
      </div>
    );
  }
}

export default Rover;