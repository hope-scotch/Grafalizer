import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Main from './Main.js'
import Header from './Header.js'

const App = () => {

  const [mode, setMode] = useState(0)
  const [algo, setAlgo] = useState('DFS')
  const [drawer, setDrawer] = useState(false)

  const modeHandler = (flag) => {
    setMode(flag)
  }

  const algoHandler = value => {
    setAlgo(value)
  }

  const drawerHandler = value => {
    setDrawer(value)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: window.innerHeight,
      width: window.width
    }}>
      <Header 
        modeHandler={modeHandler}
        algoHandler={algoHandler} />
      <Main 
        mode={mode}
        algo={algo}
        drawer={drawer}
        modeHandler={modeHandler}
        drawerHandler={drawerHandler}
        />
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
