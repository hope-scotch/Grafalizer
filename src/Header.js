import React from 'react'
import './Header.css'
import { Dropdown } from 'semantic-ui-react'

const algoOptions = [
  {
    key: 'DFS',
    text: 'DFS',
    value: 'DFS'
  },
  {
    key: 'BFS',
    text: 'BFS',
    value: 'BFS'
  },
  {
    key: 'Dijkstra',
    text: 'Dijkstra',
    value: 'Dijkstra'
  }
]

const Header = ({ modeHandler, algoHandler }) => {
  return (
    <div className="header-container">
      <span
        style={{
          color: 'white',
          margin: '10px'
        }}>
        Algorithms{'  '}
        <Dropdown
          inline
          options={algoOptions}
          defaultValue={algoOptions[0].value}
          onChange={(e, d) => { algoHandler(d.value) }}
          />
      </span>
      <div className="button-container">
        <button 
          className='new-node all-button' 
          onClick={() => modeHandler(0)}>
        <div className='new-node-main'>N</div>
        </button>
        <button className="directed all-button" 
          onClick={() => modeHandler(1)}>
          <div className='arrow' />
          <div className='arrow-head left' />
        </button>
        <button 
          className="undirected all-button" 
          onClick={() => modeHandler(-1)}>
          <div className='arrow' />
          <div className='arrow-head right'/>
          <div className='arrow-head left'/>
        </button>
        <button 
          style={{fontSize: '0.8em'}}
          className='new-node all-button' 
          onClick={() => modeHandler(3)}>
        <div>Run</div>
        </button>
        <button 
          style={{
            fontSize: '0.7em'
          }}
          className='new-node all-button' 
          onClick={() => modeHandler(4)}>
        <div>Reset</div>
        </button>
        
      </div>
    </div>
  )
}

export default Header