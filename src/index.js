import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Main from './Main.js'
import Header from './Header.js'

const App = () => {

  const [mode, setMode] = useState(0)
  const [algo, setAlgo] = useState('DFS')

  const modeHandler = (flag) => {
    setMode(flag)
  }

  const algoHandler = value => {
    setAlgo(value)
  }

  return (
    <div>
      <Header 
        modeHandler={modeHandler}
        algoHandler={algoHandler} />
      <Main 
        mode={mode}
        algo={algo}
        modeHandler={modeHandler}
        />
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
