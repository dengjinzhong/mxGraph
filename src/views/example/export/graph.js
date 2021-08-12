import mxgraph from '@/utils/mxgraph'
import _ from 'lodash'

const {
  mxGraph, mxConstants, mxEdgeStyle, mxEvent, mxGraphHandler, mxConnectionHandler, mxImage,
  mxCodec, mxUtils
} = mxgraph

export class Graph extends mxGraph {
  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
    this._setDefaultConfig()
    this._setDefaultEdgeStyle()
  }

  _setDefaultConfig() {
    // 允许节点连线
    this.setConnectable(true)
    // 禁止系统鼠标右键菜单
    mxEvent.disableContextMenu(this.container)
    // 禁止拉伸节点大小
    this.setCellsResizable(false)
    // 拖拽过程对齐线
    mxGraphHandler.prototype.guidesEnabled = true
    // 禁止游离线条
    this.setDisconnectOnMove(false)
    this.setAllowDanglingEdges(false)
    mxGraph.prototype.isCellMovable = cell => !cell.edge
    // 创建触发新连接图标
    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.png', 14, 14)
  }

  _setDefaultEdgeStyle() {
    const style = this.stylesheet.getDefaultEdgeStyle()
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
    style[mxConstants.STYLE_STROKECOLOR] = '#409EFF'
    style[mxConstants.STYLE_ROUNDED] = true
  }

  exportModelXML() {
    const enc = new mxCodec(mxUtils.createXmlDocument())
    const node = enc.encode(this.getModel())
    return mxUtils.getPrettyXml(node)
  }

  importModelXML(xmlTxt) {
    this.getModel().beginUpdate()
    try {
      const doc = mxUtils.parseXml(xmlTxt)
      const root = doc.documentElement
      const dec = new mxCodec(root.ownerDocument)
      dec.decode(root, this.getModel())
    } finally {
      this.getModel().endUpdate()
    }
  }
}

export function initView(container) {
  const graph = new Graph(container)
  const parent = graph.getDefaultParent()
  const model = graph.getModel()
  model.beginUpdate()
  try {
    const v1 = graph.insertVertex(parent, '0-1', { name: { a: '1' }, a: '132' }, 20, 20, 120, 40)
    const v2 = graph.insertVertex(parent, '0-2', '流程2', 220, 20, 120, 40)
    const v3 = graph.insertVertex(parent, '0-3', '流程3', 220, 100, 120, 40)
    const v4 = graph.insertVertex(parent, '0-4', '流程4', 220, 200, 120, 40)
    const e1 = graph.insertEdge(parent, null, '', v1, v2)
  } finally {
    model.endUpdate()
  }
  return graph
}
