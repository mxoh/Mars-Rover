import React from 'react';
import ReactDOM from 'react-dom';
import './index1.css';
import Rover from './Rover1';

ReactDOM.render(<Rover
	dimensions={[8, 8]}
  start={[0, 0]}
/>, document.getElementById('root'));