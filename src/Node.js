import React, { useState } from 'react'

import './Node.css'

const Node = ({ x, y, id, selected, changeState }) => {

  return (
    <a
      className={selected === id ? 'node-main node-main-active': 'node-main'}
      style={{
        left: x - 15, 
        top: y - 15,
      }}
      onClick={() => {
        changeState(id)}
      }
      >
      <div>{id}</div>
    </a>
  )
}

export default Node