import mxgraph from '@/utils/mxgraph'
import { dropGraph, dropSuccessCb } from '@/utils/mxgraph/Graph'

const {
  mxGraph, mxUtils, mxEvent, mxCell, mxGeometry
} = mxgraph

export class Graph extends mxGraph {
  #dragData

  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
    this._setDefaultConfig()
  }

  setDragData(data) {
    this.#dragData = data
  }

  makeDraggable(dom) {
    const dragElt = document.createElement('div')
    dragElt.style.border = 'dashed black 1px'
    dragElt.style.width = '120px'
    dragElt.style.height = '40px'
    const dropGraph = this._dropGraph(this.container)
    const dropSuccessCb = this._dropSuccessCb.bind(this)
    mxUtils.makeDraggable(dom, dropGraph, dropSuccessCb, dragElt, null, null, this.autoscroll, true)
  }

  _setDefaultConfig() {
    this.getLabel = (cell) => {
      const cellData = cell.value
      if (typeof cell.value === 'object' && cellData.name) {
        return mxUtils.htmlEntities(cellData.name, false)
      } else {
        return ''
      }
    }
  }
  _dropGraph(container) {
    return (evt) => {
      const x = mxEvent.getClientX(evt)
      const y = mxEvent.getClientY(evt)
      // 获取 x,y 所在的元素
      const elt = document.elementFromPoint(x, y)
      // 如果鼠标落在graph容器
      if (mxUtils.isAncestorNode(container, elt)) {
        return this
      }
      // 鼠标落在其他地方
      return null
    }
  }

  // drop成功后新建一个节点
  _dropSuccessCb(graph, evt, target, x, y) {
    const cell = new mxCell(this.#dragData, new mxGeometry(0, 0, 120, 40))
    cell.vertex = true
    const cells = graph.importCells([cell], x, y, target)
    if (cells != null && cells.length > 0) {
      graph.setSelectionCells(cells)
    }
  }
}

export function initView(container) {
  const graph = new Graph(container)
  const parent = graph.getDefaultParent()
  const model = graph.getModel()
  model.beginUpdate()
  try {
  } finally {
    model.endUpdate()
  }
  return graph
}
