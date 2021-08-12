import mxgraph from '@/utils/mxgraph'

const {
  mxGraph, mxCompactTreeLayout
} = mxgraph

export class Graph extends mxGraph {
  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
  }

  resetLayout() {
    const layout = new mxCompactTreeLayout(this)
    const model = this.getModel()
    const parent = this.getDefaultParent()
    model.beginUpdate()
    try {
      layout.execute(parent)
    } finally {
      model.endUpdate()
    }
  }
}

export function initView(container) {
  const graph = new Graph(container)
  const parent = graph.getDefaultParent()
  const model = graph.getModel()
  model.beginUpdate()
  const vertexMap = new Map()
  try {
    for (let i = 1; i < 10; i++) {
      const vertex = graph.insertVertex(parent, null, '流程' + i, 0, 0, 120, 40)
      vertexMap.set(i, vertex)
      graph.insertEdge(parent, null, '', vertexMap.get(Math.floor(i / 2)), vertex) // 构建一棵树
    }
  } finally {
    model.endUpdate()
  }

  return graph
}
