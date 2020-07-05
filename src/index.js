import React from 'react';
import ReactDOM from 'react-dom';
import './index11.css';

// TODO: Find a nice sprite library/component to add animations etc
import rover from './img/rover.png';
import obstacle from './img/obstacle.png';
const backgroundCSSSpritePaths = {
  rover: [
    `url(${rover}) -154px -23px`,
    `url(${rover}) -278px -84px`,
    `url(${rover}) -154px -145px`,
    `url(${rover}) -34px 150px`,
  ],
  tile: `url(${rover}) 176px 148px`,
  obstacle: `url(${obstacle}) -37px -145px`,
}

const roverTurnVectors = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // N E S W

class InputButton extends React.Component {
  render() {
    return (
      <button className='input' disabled={this.props.disabled || false} onClick={() => { this.props.onClick(this.props.action) }}>
        {this.props.action}
      </button>
    )
  }
}

class Tile extends React.Component {
  render() {
    // Sprite offsets - Tank and turret sprites from Command and Conquer: Red Alert 
    var classString = `tile ${this.props.hasRover ? 'rover' : ''} ${this.props.hasObstacle ? 'obstacle' : ''}`
    let backgroundCSS = backgroundCSSSpritePaths.tile;
    if (this.props.hasObstacle) {
      backgroundCSS = backgroundCSSSpritePaths.obstacle;
    }
    if (this.props.hasRover) {
      backgroundCSS = backgroundCSSSpritePaths.rover[this.props.direction];
    }

    return (
      <td className={classString} style={{ background: backgroundCSS }} >
        {/* {this.props.value[0]},
        {this.props.value[1]} */}
      </td>
    )
  }
}

class Board extends React.Component {

  renderRow(y) {
    var tiles = [];
    for (let x = 0; x < this.props.dimensions[0]; ++x) {
      var hasRover = x === this.props.roverPosition[0] && y === this.props.roverPosition[1];
      var hasObstacle = this.props.obstacles.filter(o => o[0] === x && o[1] === y).length > 0;
      tiles.push(
        <Tile
          key={[x, y]}
          value={[x, y]}
          hasRover={hasRover}
          hasObstacle={hasObstacle}
          direction={this.props.roverDirection}
        />);
    }
    return (<tr className='row' key={y} >{tiles}</tr>);
  }

  render() {
    // loop through backwards through y values, forwards through x values
    // to set up coordinate grid with origin (0,0) in lower left corner
    var rows = [];
    for (let y = this.props.dimensions[1] - 1; y >= 0; --y) {
      rows.push(this.renderRow(y));
    }
    return (<table>{rows}</table>);
  }

}

class MarsRoverSimulator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inputString: '',
      history: [{
        move: null,
        position: props.roverStartPosition,
        direction: 0
      }],
      stepNumber: 0
    };
  }

  addMove(i) {
    this.setState({
      inputString: this.state.inputString.concat(i)
    })
  }

  hasMoreMoves() {
    return this.state.history.length <= this.state.inputString.length;
  }

  executeNextMove() {
    if (this.hasMoreMoves()) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.processMove(this.state.inputString[this.state.stepNumber++]);
    } else {
      clearInterval(this.state.intervalId);
    }
  }

  processMove(move) {
    //console.log(`Processing move ${move}`)
    const history = this.state.history;
    const current = history[history.length - 1];

    if (move === 'F' || move === 'B') {

      var moveDir = move === 'F' ? [1, 1] : [-1, -1];
      var props = this.props;

      // Calculate next position
      const newPosition = current.position.map(function (p, idx) {
        return mod_floor(p + roverTurnVectors[current.direction][idx] * moveDir[idx], props.dimensions[idx]);
      });

      // Check if new position collides with an obstacle
      const blocked = this.props.obstacles.filter(arr => arr[0] === newPosition[0] && arr[1] === newPosition[1]).length > 0;
      if (blocked) {
        this.setState({
          history: history.concat([{
            move: move + ' (blocked)',
            position: current.position,
            direction: current.direction
          }])
        });
      } else {
        this.setState({
          history: history.concat([{
            move: move,
            position: newPosition,
            direction: current.direction
          }])
        });
      }

    } else if (move === 'L' || move === 'R') {

      // Perform rotation
      let newDirection = mod_floor(current.direction + (move === 'R' ? 1 : -1), 4);
      this.setState({
        history: history.concat([{
          move: move,
          position: current.position,
          direction: newDirection
        }])
      });

    }

    //console.dir(this.state)

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    })
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move + ': ' + step.move :
        'Go to starting position';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            dimensions={this.props.dimensions}
            obstacles={this.props.obstacles}
            roverPosition={current.position}
            roverDirection={current.direction}
          />
        </div>
        <div className="game-info">
          {
            <div>Input String: {this.state.inputString}</div>
          }

          <InputButton action="L" onClick={(i) => this.addMove(i)} />
          <InputButton action="R" onClick={(i) => this.addMove(i)} />
          <InputButton action="F" onClick={(i) => this.addMove(i)} />
          <InputButton action="B" onClick={(i) => this.addMove(i)} />

          <InputButton action="Run next move" disabled={!this.hasMoreMoves()} onClick={() => this.executeNextMove()} />

          <ol>{moves}</ol>

        </div>
      </div>
    );
  }
}


function mod_floor(a, n) {
  return ((a % n) + n) % n;
}

ReactDOM.render(
  <MarsRoverSimulator
    dimensions={[9, 9]}
    roverStartPosition={[0, 0]}
    obstacles={[[1, 2], [4, 3]]}
  />,
  document.getElementById('root')
);