import React from 'react'

import './Drawer.css'

const INF = 99999999999999

const Drawer = ({ drawer, algo, bundle }) => {
  
  let nodeList = []
  let justifyContent = 'space-evenly'

  if (algo === 'DFS' || algo === 'BFS') {
    justifyContent = 'space-around'
    bundle.map((node) => {
      nodeList.push(<span 
        style={{
          width: '25px',
          height: '25px',
          border: '2px solid white',
          borderRadius: '50%',
          boxShadow: '0px 0px 0px 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8em',
          margin: '5px',
          cursor: 'pointer'
        }}>{node.node}</span>)
    })
  }
  if (algo === 'Dijkstra') {
    justifyContent = 'flex-start'
    let maxDist = 0
    bundle.forEach((node) => {
      if (node.dist === INF) return
      maxDist = Math.max(node.dist, maxDist)
    })

    bundle.map((node) => {

      if (node.dist === INF) {
        nodeList.push(<div
          style={{
            width: '100%',
            height: '25px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{
            margin: '5px'
          }}>{node.node}</span>
          <span style={{
            backgroundColor: 'red',
            height: '10px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}><span>&#x221E;</span></span>
        </div>)
      }
      else {
        let barwidth = (node.dist / maxDist) * 100
        if (maxDist === 0) barwidth = 0
        
        nodeList.push(
          <div
            style={{
              width: '100%',
              height: '25px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{
              margin: '5px'
            }}>{node.node}</span>
            <span style={{
              backgroundColor: 'green',
              height: '10px',
              width: `${barwidth * 0.8}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7em',
              transition: 'width 1s'
            }}>{node.dist === 0 ? '': node.dist }</span>
          </div>
        )
      }
    })
  }

  return (
    <div className={drawer ? 'drawer-container drawer-container-hover': 'drawer-container' } >
    Analysis
    <div 
      className='drawer-node-container'
      style={{
        justifyContent: justifyContent
      }}>{nodeList}</div>
    </div>
  )
}

export default Drawer