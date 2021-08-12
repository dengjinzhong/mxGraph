import mxgraph from '@/utils/mxgraph'

const {
  mxGraph, mxRubberband, mxCellOverlay, mxImage, mxEvent,
  mxEdgeStyle, mxMorphing, mxUtils, mxConstants, mxCompactTreeLayout,
  mxGraphHandler, mxConnectionHandler, mxLayoutManager
} = mxgraph

export class Graph extends mxGraph {
  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
    this._setDefaultConfig()
    this._setLayout()
    this._setDefaultEdgeStyle()
  }

  _setDefaultConfig() {
    // 允许节点连线
    this.setConnectable(true)
    // 指定是否应该启用平移。
    this.setPanning(true)
    // 指定是否激活鼠标左键的移动。 将此设置为true可能与mxRubberband冲突。 默认是假的。
    this.panningHandler.useLeftButtonForPanning = true
    // 不允许悬浮线条
    this.setAllowDanglingEdges(false)
    // 指定是否应该选择新的边。 默认是正确的
    this.connectionHandler.select = false
    // 视图偏移位置
    this.view.setTranslate(20, 20)
    // 使橡皮带选择
    new mxRubberband(this)
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

  _setLayout() {
    const layout = this.layout = new mxCompactTreeLayout(this)
    // 关键代码
    layout.edgeRouting = false
  }

  _setDefaultEdgeStyle() {
    const style = this.stylesheet.getDefaultEdgeStyle()
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector
    style[mxConstants.STYLE_STROKECOLOR] = '#409EFF'
    style[mxConstants.STYLE_ROUNDED] = true
  }

  addOverlay(cell) {
    const graph = this
    // 创建一个图标并设置其鼠标上移样式为手型
    const overlay = new mxCellOverlay(new mxImage('/mxgraph/images/add.png', 24, 24), 'Add outgoing')
    overlay.cursor = 'hand'
    // 图标点击事件
    overlay.addListener(mxEvent.CLICK, function(sender, evt2) {
      // 清楚选择
      graph.clearSelection()
      // 获取当前节点
      const geo = graph.getCellGeometry(cell)
      let vertex
      graph._executeLayout(function() {
        const parent = graph.getDefaultParent()
        // 根据当前节点位置创建一个节点并添加图标
        vertex = graph.insertVertex(parent, null, 'World!', geo.x, geo.y, 80, 30)
        graph.addOverlay(vertex)
        // 如果currenroot不为空，则清除视图并重新验证
        graph.view.refresh(vertex)
        const e1 = graph.insertEdge(parent, null, '', cell, vertex)
      }, function() {
        // 平移图形以显示给定的单元格。 单元格可以在容器中居中。
        //
        // 如果<container>没有滚动条，则要居中给定图形，请使用以下代码。
        //
        // [code] var bounds = graph.getGraphBounds(); graph.view.setTranslate(-bounds.x - (bounds.width - container.clientWidth) / 2, -bounds.y - (bounds.height - container.clientHeight) / 2); [/code]
        graph.scrollCellToVisible(vertex)
        // var bounds = graph.getGraphBounds()
        // graph.view.setTranslate(-bounds.x - (bounds.width - graph.container.clientWidth) / 2,
        //   -bounds.y - (bounds.height - graph.container.clientHeight) / 2)
      })
    })
    graph.addCellOverlay(cell, overlay)
  }

  _executeLayout(change, post) {
    const graph = this
    graph.getModel().beginUpdate()
    try {
      change && change()
      graph.layout.execute(graph.getDefaultParent())
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      // 用于异步动画图形布局结果的新API
      const morph = new mxMorphing(graph)
      morph.addListener(mxEvent.DONE, mxUtils.bind(this, function() {
        graph.getModel().endUpdate()
        post && post()
      }))
      morph.startAnimation()
    }
  }
}

export function initView(container) {
  const graph = new Graph(container)
  const parent = graph.getDefaultParent()
  const model = graph.getModel()
  model.beginUpdate()
  try {
    const v1 = graph.insertVertex(parent, null, 'Hello,', 0, 0, 80, 30)
    graph.addOverlay(v1)
  } finally {
    model.endUpdate()
  }
  return graph
}
