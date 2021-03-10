import Node from './Node.js'
import Arrow from './Arrow.js'
import PriorityQueue from './PriorityQueue.js'

const INF = 99999999999999

class Queue {
  items = []
  front = () => this.items[0]
  push = (item) => this.items.push(item)
  pop = () => this.items.shift()
  empty = () => this.items.length === 0
  size = () => this.items.length
}

export const runAlgo = async (algo, items, nodes, graph, changeState, 
  updateMain, bundle, edges, arrows, removeEdge, addWeight) => {

  const sleep = delay => new Promise ((resolve) => setTimeout(resolve, delay))
  
  let vis = Array(nodes.length).fill(false)
  let dist = Array(nodes.length).fill(INF)
  let p = Array(nodes.length).fill(-1)
  
  const resetVisited = () => {
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
  
  const highlightEdge = async (from, to, rev) => {
    for (let i = 0; i < edges.length; i++) {
      if (edges[i] === undefined)
        continue
      if (edges[i].from === from && edges[i].to === to) {
        let start = 0, end = 100, change = 1
        if (rev) {
          // [from, to] = [to, from] 
          start = 100
          end = 0
          change = -1 
        }

        for (let done = start; done != end; done += (change)) {
          arrows[i] = {
            component: 
              <Arrow
                fromx={nodes[from].x}
                fromy={nodes[from].y}
                tox={nodes[to].x}
                toy={nodes[to].y}
                id={i}
                flag={edges[i].flag === 1 ? 'directed': 'undirected'}
                removeEdge={removeEdge}
                addWeight={addWeight}
                progress={`${done}%`}
              />,
            id: i
          }
          updateMain()
          await sleep(5)
        }
        break
      }
    }
  }

  const dfs = async (at, vis) => {
    
    bundle.push({ node: at })

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
      selected={1000 + at} 
      changeState={changeState} 
      />

    updateMain()
    await sleep(500)
  }

  const bfs = async (start, vis) => {
    let p = new Array(nodes.length).fill(-1)
    const q = new Queue()
    q.push(start)
    vis[start] = true

    while(!q.empty()) {
      const at = q.front()
      q.pop()

      bundle.push({ node: at })

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
          p[edge.to] = at
          vis[edge.to] = true
          q.push(edge.to)
        }
      })
    }
  }

  if (algo === 'DFS') {
    for (let id = 1; id < nodes.length; id ++) {
      if (!vis[id])
        await dfs(id, vis)
    }
    await sleep(2000)
    resetVisited()
  }

  if (algo === 'BFS') {

    for (let id = 1; id < nodes.length; id ++) {
      if (!vis[id])
        await bfs(id, vis)
    }
    await sleep(2000)
    resetVisited()
  }

  if (algo === 'Dijkstra') {

    const pq = new PriorityQueue()
    pq.insert(1, 0)
    dist[1] = 0

    for (let i = 1; i < nodes.length; i++) {
      bundle.push({node: i, dist: INF})
    }

    while(!pq.empty()) {
      const at = pq.front().element
      pq.pop_front()

      bundle[at - 1] = {node: at, dist: dist[at]}

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

      for (let i = 0; i < graph[at].length; i++) {
        const to = graph[at][i].to
        const len = graph[at][i].weight

        if (dist[at] + len < dist[to]) {
          let path = []
          
          for (let k = to; k !== 1; k = p[k]) {
            path = [k, ...path]
            if (p[k] === -1) break
          }
          
          path = [1, ...path]
          
          await highlightEdge(p[to], to, true)

          pq.remove(to, dist[to])
          dist[to] = dist[at] + len
          p[to] = at
          pq.insert(to, dist[to])
          
          await highlightEdge(at, to, false)

          items[to - 1] = 
          <Node
            x={nodes[to].x}
            y={nodes[to].y}
            id={to}
            selected={2000 + to}
            changeState={changeState}
          />
          updateMain()
          await sleep(500)

          // console.log(path)
          bundle[to - 1] = {node: to, dist: dist[to]}
        }
      }

      for (let i = 0; i < graph[at].length; i++) {
        const to = graph[at][i].to;

        items[to - 1] =
        <Node
          x={nodes[to].x}
          y={nodes[to].y}
          id={to}
          selected={0}
          changeState={changeState}
        />
        updateMain()
        await sleep(50)
      }

      items[at - 1] = 
        <Node
          x={nodes[at].x}
          y={nodes[at].y}
          id={at}
          selected={1000 + at}
          changeState={changeState}
        />
      updateMain()
      await sleep(1000)
    }

    await sleep(2000)
    resetVisited()

  }
}