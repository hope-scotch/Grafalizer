import Node from './Node.js'

class Queue {
  items = []
  front = () => this.items[0]
  push = (item) => this.items.push(item)
  pop = () => this.items.shift()
  empty = () => this.items.length === 0
  size = () => this.items.length
}

export const runAlgo = async (algo, items, nodes, graph, changeState, updateMain) => {

  const sleep = delay => new Promise ((resolve) => setTimeout(resolve, delay))
  
  let vis = Array(nodes.length).fill(false)
  
  const dfs = async (at, vis) => {
    
    console.log(at, 'After sleep')

    vis[at] = true
    
    items[at - 1] =
      <Node 
      x={nodes[at].x} 
      y={nodes[at].y} 
      id={at} 
      selected={at} 
      changeState={changeState} 
      />
        
    updateMain()
    await sleep(500)
      
    if (graph[at] === undefined)
      graph[at] = []
      
    for (let i = 0; i < graph[at].length; i ++) {
      const edge = graph[at][i]

      if (!vis[edge.to])
        await dfs(edge.to, vis)
    }

    items[at - 1] =
      <Node 
      x={nodes[at].x} 
      y={nodes[at].y} 
      id={at} 
      selected={0} 
      changeState={changeState} 
      />

    updateMain()
    await sleep(500)
  }

  const bfs = async (start, vis) => {
    const q = new Queue()
    q.push(start)
    vis[start] = true

    while(!q.empty()) {
      const at = q.front()
      q.pop()

      items[at - 1] = 
        <Node
          x={nodes[at].x}
          y={nodes[at].y}
          id={at}
          selected={at}
          changeState={changeState}
        />
      
      updateMain()
      await sleep(500)

      if (graph[at] === undefined)
        graph[at] = []

      graph[at].forEach((edge) => {
        if (!vis[edge.to]) {
          vis[edge.to] = true
          q.push(edge.to)
        }
      })
    }

    for (let id = 0; id < items.length; id ++) {
      items[id] = 
        <Node
          x={nodes[id + 1].x}
          y={nodes[id + 1].y}
          id={id + 1}
          selected={0}
          changeState={changeState}
        />
      updateMain()
    }
  }

  if (algo === 'DFS') {
    for (let id = 1; id < nodes.length; id ++) {
      if (!vis[id])
        await dfs(id, vis)
    }
  }

  if (algo === 'BFS') {
    for (let id = 1; id < nodes.length; id ++) {
      if (!vis[id])
        await bfs(id, vis)
    }
  }
}