
class QElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority
  }
}

class PriorityQueue {
  constructor() {
    this.items = []
  }

  insert(element, priority) {
    const qelement = new QElement(element, priority)
    let contain = false

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qelement.priority) {
        this.items.splice(i, 0, qelement)
        contain = true
        break
      }
    }

    if (!contain) {
      this.items.push(qelement)
    }
  }

  remove(element, priority) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].element === element && this.items[i].priority === priority) {
        this.items.splice(i, 1)
        break
      }
    }
  }

  pop_front() {
    if (!this.empty())
      this.items.shift()
  }

  front() {
    if (!this.empty())
      return this.items[0]
  }

  empty() {
    return this.items.length == 0
  }
}

export default PriorityQueue