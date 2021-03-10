import React, { useState } from 'react'

import './Arrow.css'

const RADIUS = 30

const Arrow = ({ fromx, fromy, tox, toy, id, flag, removeEdge, addWeight, progress = '0%'}) => {
  
  const [visible, setVisibility] = useState('hidden')
  const [value, setValue] = useState('')

  const delx = tox - fromx
  const dely = toy - fromy
  const width = Math.sqrt((delx * delx) + (dely * dely)) - RADIUS / 2

  const cenx = (tox + fromx) / 2
  const ceny = (toy + fromy) / 2
  
  let angle = Math.atan((fromy - toy) / (tox - fromx))
  let offs = 0

  if (angle <= 0) {
    offs = 25
    if (fromy <= toy && tox > fromx)
      angle = 2 * Math.PI + angle
    else
      angle = Math.PI + angle
  } else {
    if (fromy <= toy && tox < fromx)
      angle = Math.PI + angle
  }

  const handleChange = e => {
    setValue(e.target.value)
    e.target.style.width = e.target.value.length + 2 + 'ch'
  }

  if (fromx === tox && fromy === toy) {
    return (
      <div>
        <input
          className={'input-weight'}
          autoFocus
          placeholder={0} 
          type='text' 
          style={{
            position: 'absolute',
            top: ceny - RADIUS * 2,
            left: cenx - 0.25 * RADIUS,
            visibility: visible,
            zIndex: 3
          }}
          value={value}
          onChange={handleChange}
          onBlur={() => {
            if (value !== '')
              addWeight(id, value)
          }}
          onSubmit={() => {
            if (value !== '')
              addWeight(id, value)
          }}
        ></input>
        <div
          className={`circular-arrow-surround ${flag}-circular-arrow`}
          style={{
            position: 'absolute',
            top: ceny - RADIUS,
            left: cenx - (RADIUS / 1.25),
            display: 'flex',
            borderRadius: '50%',
            zIndex: 1
          }}
          onClick={() => setVisibility('visible')}
          onContextMenu = {(e) => {
            e.preventDefault()
            removeEdge(id)}
          }>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <input
          className={'input-weight'}
          autoFocus
          placeholder={0} 
          type='text' 
          style={{
            position: 'absolute',
            top: ceny - offs,
            left: cenx,
            visibility: visible,
            zIndex: 3
          }}
          value={value}
          onChange={handleChange}
          onBlur={() => {
            if (value !== '')
              addWeight(id, value)
          }}
          onSubmit={() => {
            if (value !== '')
              addWeight(id, value)
          }}
        ></input>
        <div 
          className='arrow-surround'
          style={{
            position: 'absolute',
            top: ceny - 3,
            left: cenx - (width / 2) ,
            transform: `rotate(-${angle}rad)`,
            height: 6, 
            width: width,
            display: 'flex',
            zIndex: 1
          }}
          onClick={() => setVisibility('visible')}
          onContextMenu = {(e) => {
            e.preventDefault()
            removeEdge(id)}
          }>
          <div className={`arrow-main ${flag}-arrow`}>
            <div 
              style={{
                width: progress,
                zIndex: 10,
                backgroundColor: 'red'
              }}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Arrow