import React, { Component } from "react";

import roverLeft from "./img/rovers/left.png";
import roverRight from "./img/rovers/right.png";
import roverUp from "./img/rovers/up.png";
import roverDown from "./img/rovers/down.png";

const tileBackgrounds = {
  rover: [
    `url(${roverUp})`,
    `url(${roverRight})`,
    `url(${roverDown})`,
    `url(${roverLeft})`
  ],
  tile: `#fff`
};

class Tile extends Component {
  render() {
    var classString = `tile ${this.props.hasRover ? "rover" : ""}`;
    let background = tileBackgrounds.tile;

    if (this.props.hasRover) {
      background = tileBackgrounds.rover[this.props.direction];
    }

    return (
      <td className={classString} style={{ background: background }}>
        {}
      </td>
    );
  }
}

export default Tile;