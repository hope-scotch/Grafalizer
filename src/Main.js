import React from 'react'

import Node from './Node.js'
import Arrow from './Arrow.js'
import Drawer from './Drawer.js'

import './Main.css'
import { runAlgo } from './runAlgo.js'

class Main extends React.Component {
  constructor() {
    super()
    this.canvasRef = React.createRef()
  }

  state = { nodes: [{}], items: [], edges: [{}], arrows: [{}], selected: 0, adj: {}, bundle: [], notif: false }

  forceRender = () => this.forceUpdate()

  componentDidUpdate(prevProps) {
    if (this.props.algo !== prevProps.algo) {
      this.props.drawerHandler(false)
    }
    if (this.props.mode === 'run-algo') {
      if (this.state.selected) {
        const start = this.state.selected
        this.state.selected = 0

        this.formAdjacencyList()
        this.state.bundle = []
        this.props.drawerHandler(true)

        runAlgo(this.props.algo, this.state.items, this.state.nodes, this.state.adj, 
              this.changeState, this.forceRender, this.state.bundle, this.state.edges, this.state.arrows,
              this.removeEdge, this.addWeight, start)
        this.props.modeHandler(0)
        this.state.adj = []
      }
    }
    if (this.props.mode === 3) {
      this.state.notif = true
      this.props.drawerHandler(true)

      this.props.modeHandler('run-algo')

    } else if (this.props.mode === 4 && prevProps !== this.props) {
      this.setState({ nodes: [{}], items: [], edges: [{}], arrows: [{}], selected: 0, adj: {}, bundle: [{}] })
      this.props.modeHandler(0)
    }
  }

  formAdjacencyList = () => {
    this.state.edges.forEach((edge) => {
      if (edge === undefined)
        return
        
      if (this.state.adj[edge.from] === undefined)
        this.state.adj[edge.from] = []
      this.state.adj[edge.from].push({to: edge.to, weight: edge.weight })

      if (edge.flag === -1) {
        if (this.state.adj[edge.to] === undefined)
          this.state.adj[edge.to] = []
        this.state.adj[edge.to].push({ to: edge.from, weight: edge.weight })
      }
    })
  }

  removeEdge = id => {
    let array = [...this.state.arrows]
    let edgeList = [...this.state.edges]

    array[id] = {}
    delete edgeList[id]

    this.setState({edges: edgeList, arrows: array})
  }

  changeState = (id) => {
    if (this.props.mode === 1 || this.props.mode === -1 || this.props.mode === 'run-algo') {
      if (this.state.selected === 0) {
        
        this.setState({ selected: id })

        if (this.props.mode === 'run-algo') {
          this.setState({ notif: false })
          return
        }

        let itemList = [...this.state.items]
        let nodeList = [...this.state.nodes]

        const _x = nodeList[id].x
        const _y = nodeList[id].y

        itemList[id - 1] = 
          <Node 
            x = {_x}
            y = {_y}
            id = {id}
            selected = {id}
            changeState = {this.changeState}
          />

        this.setState({ items: itemList })
      }
      else if (this.state.selected !== 0) {
        let itemList = [...this.state.items]
        let nodeList = [...this.state.nodes]

        const _x = nodeList[this.state.selected].x
        const _y = nodeList[this.state.selected].y

        itemList[this.state.selected - 1] = 
          <Node
            x = {_x}
            y = {_y}
            id = {this.state.selected}
            selected = {0}
            changeState = {this.changeState}
             />
        
        this.setState({ items: itemList, selected: 0 })

        const x = this.state.nodes[this.state.selected]
        const y = this.state.nodes[id]

        if (this.props.mode === 1) {
          if (this.state.edges.some((edge) => {
              if (edge === undefined) return false
              return (edge.from === this.state.selected && edge.to === id)
            })
          ) return

          const _id = this.state.edges.length

          this.setState({
            edges: [...this.state.edges, 
            {
              id: _id,
              from: this.state.selected, 
              to: id, 
              weight: 0,
              flag: 1
            }],
            arrows: [...this.state.arrows,
              {
                component: 
                  <Arrow 
                    fromx={x.x}
                    fromy={x.y}
                    tox={y.x}
                    toy={y.y} 
                    id={_id}
                    flag='directed'
                    removeEdge = {this.removeEdge}
                    addWeight = {this.addWeight}
                    />,
                id: _id
              }
            ]
          })
        }

        if (this.props.mode === -1) {
          const _id = this.state.edges.length

          if (this.state.edges.some((edge) => {
            if (edge === undefined) return false
            return (edge.from === this.state.selected && edge.to === id) &&
                    (edge.from === id && edge.to === this.state.selected)
            })
          ) return

          this.setState({
            edges: [...this.state.edges,
            {
              from: this.state.selected,
              to: id,
              weight: 0,
              flag: -1
            }],
            arrows: [...this.state.arrows, 
              {
                component: 
                  <Arrow 
                    fromx={x.x}
                    fromy={x.y}
                    tox={y.x}
                    toy={y.y} 
                    id={_id}
                    flag={'undirected'}
                    removeEdge = {this.removeEdge}
                    addWeight = {this.addWeight}
                    />,
                id: _id
              }
            ]
          })
        }
      }
    }
  }

  addWeight = (id, weight) => {
    let edgeList = [...this.state.edges]
    edgeList[id].weight = parseInt(weight)

    this.setState({
      edges: edgeList  
    })
  }

  createNode = (event) => {
    const rect = this.canvasRef.current.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    let id = this.state.nodes.length
   
    var invalid = this.state.nodes.some((node) => {
      const dist = Math.sqrt((node.x - x) * (node.x - x) + (node.y - y) * (node.y - y))
      return dist < 35
    })

    invalid = invalid || (this.state.nodes.length > 30)

    if (!invalid) {
      this.setState({
        nodes: [...this.state.nodes, {x, y, _id: id}],
        items: [...this.state.items, 
          <Node 
            x={x} 
            y={y} 
            id={id}
            selected={this.state.selected}
            changeState={this.changeState}
          />]
      })
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='canvas'
            style={{
              height: '90%',
              width: '65%',
            }} 
            onClick={(e) => {
              if (this.props.mode === 0)
                this.createNode(e)}} 
            ref={this.canvasRef}
            onContextMenu={(e) => e.preventDefault()}>
        </div>
        <div className='node-container'>{this.state.items}</div>
        <div className='arrow-container'>{this.state.arrows.map((arrow) => arrow.component)}</div>
        <Drawer drawer={this.props.drawer} algo={this.props.algo} bundle={this.state.bundle} notif={this.state.notif} />
      </div>
  )}
}

export default Main