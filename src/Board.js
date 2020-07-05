import React, { Component } from "react";
import Tile from "./Tile";

class Board extends Component {
  renderRow(y) {
    var tiles = [];
    for (let x = 0; x < this.props.dimensions[0]; ++x) {
      var hasRover =
        x === this.props.position[0] && y === this.props.position[1];

      tiles.push(
        <Tile
          key={[x, y]}
          value={[x, y]}
          hasRover={hasRover}
          direction={this.props.direction}
        />
      );
    }
    return (
      <tr className="row" key={y}>
        {tiles}
      </tr>
    );
  }

  render() {
    var rows = [];
    for (let y = this.props.dimensions[1] - 1; y >= 0; --y) {
      rows.push(this.renderRow(y));
    }
    return <table>{rows}</table>;
  }
}

export default Board;