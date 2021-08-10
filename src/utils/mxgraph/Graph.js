import mxgraph from './index'
import _ from 'lodash'

const {
  mxGraph,
  mxVertexHandler,
  mxConstants,
  mxCellState,
  mxPerimeter,
  mxCellEditor,
  mxGraphHandler,
  mxEvent,
  mxEdgeHandler,
  mxShape,
  mxConnectionConstraint,
  mxPoint,
  mxEventObject,
  mxCodec,
  mxObjectCodec,
  mxUtils,
  mxImageExport,
  mxXmlCanvas2D,
  mxCodecRegistry,
  mxCell,
  mxGeometry,
  mxConnectionHandler,
  mxImage
} = mxgraph

Object.assign(mxEvent, {
  EDGE_START_MOVE: 'edgeStartMove',
  VERTEX_START_MOVE: 'vertexStartMove',
})

const pokeElementIdSeed = 0

export class Graph extends mxGraph {
  static getStyleDict(cell) {
    return _.compact(cell.getStyle().split(';'))
      .reduce((acc, item) => {
        const [key, value] = item.split('=')
        acc[key] = value
        return acc
      }, {})
  }

  static convertStyleToString(styleDict) {
    const style = Object.entries(styleDict)
      .map(([key, value]) => `${key}=${value}`)
      .join(';')
      .replace(/=undefined/g, '')
    return `${style};`
  }

  static getCellPosition(cell) {
    return _.pick(cell.getGeometry(), ['x', 'y'])
  }

  isPart(cell) {
    const state = this.view.getState(cell)
    const style = (state != null) ? state.style : this.getCellStyle(cell)
    return style.constituent === 1
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
    this._restoreModel()
  }

  deleteSubtree(cell) {
    const cells = []
    this.traverse(cell, true, (vertex) => {
      cells.push(vertex)
      return true
    })
    this.removeCells(cells)
  }

  exportModelXML() {
    const enc = new mxCodec(mxUtils.createXmlDocument())
    const node = enc.encode(this._getExportModel())
    return mxUtils.getPrettyXml(node)
  }

  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
    this._setDefaultConfig() // 全局配置设置
    this._configConstituent()
    this._putVertexStyle() // 添加样式类
    this._setDefaultEdgeStyle() // 设置默认连接线样式
    this._setAnchors() // 设置鼠标 hover 锚点效果
    this._configCustomEvent()
  }

  _setDefaultConfig() {
    // 允许节点连线
    this.setConnectable(true)
    // 禁止系统鼠标右键菜单
    mxEvent.disableContextMenu(this.container)
    // 禁止拉伸节点大小
    this.setCellsResizable(false)
    // 编辑时按回车键不换行，而是完成输入
    this.setEnterStopsCellEditing(true)
    mxCellEditor.prototype.escapeCancelsEditing = false
    // 失焦时完成输入
    mxCellEditor.prototype.blurEnabled = true
    // 禁止节点折叠
    this.foldingEnabled = false
    // 文本包裹效果必须开启此配置
    this.setHtmlLabels(true)
    // 拖拽过程对齐线
    mxGraphHandler.prototype.guidesEnabled = true
    // 禁止游离线条
    this.setDisconnectOnMove(false)
    this.setAllowDanglingEdges(false)
    mxGraph.prototype.isCellMovable = cell => !cell.edge

    // 禁止调整线条弯曲度
    this.setCellsBendable(false)

    // 禁止从将label从线条上拖离
    mxGraph.prototype.edgeLabelsMovable = false
  }
  /* TODO 暂时还不知道干嘛的 */
  _configConstituent() {
    // 将选择重定向到父类
    // Redirects selection to parent
    this.selectCellForEvent = (...args) => {
      const [cell] = args
      if (this.isPart(cell)) {
        args[0] = this.model.getParent(cell)
        mxGraph.prototype.selectCellForEvent.call(this, args)
        return
      }

      mxGraph.prototype.selectCellForEvent.apply(this, args)
    }
    // 重定向开始拖动到父
    // Redirects start drag to parent
    const graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent
    mxGraphHandler.prototype.getInitialCellForEvent = function getInitialCellForEvent(...args) {
      // this 是 mxGraphHandler
      let cell = graphHandlerGetInitialCellForEvent.apply(this, args)
      if (this.graph.isPart(cell)) {
        cell = this.graph.getModel().getParent(cell)
      }

      return cell
    }
  }

  _putVertexStyle() {
    const normalTypeStyle = {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
    }
    this.getStylesheet().putCellStyle('normalType', normalTypeStyle)

    const nodeStyle = {
      // 图片样式参考这个例子
      // https://github.com/jinzhanye/mxgraph-demos/blob/master/src/06.image.html
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LABEL,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
      [mxConstants.STYLE_ROUNDED]: true,
      [mxConstants.STYLE_ARCSIZE]: 6, // 设置圆角程度

      [mxConstants.STYLE_STROKECOLOR]: '#333333',
      [mxConstants.STYLE_FONTCOLOR]: '#333333',
      [mxConstants.STYLE_FILLCOLOR]: '#ffffff',
      //
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: 'none',

      [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,
      [mxConstants.STYLE_IMAGE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_IMAGE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,

      [mxConstants.STYLE_IMAGE_WIDTH]: '72',
      [mxConstants.STYLE_IMAGE_HEIGHT]: '72',
      [mxConstants.STYLE_SPACING_TOP]: '100',
      [mxConstants.STYLE_SPACING]: '8',
    }
    this.getStylesheet().putCellStyle('node', nodeStyle)

    // 设置选中状态节点的边角为圆角，默认是直角
    const oldCreateSelectionShape = mxVertexHandler.prototype.createSelectionShape
    mxVertexHandler.prototype.createSelectionShape = function createSelectionShape(...args) {
      const res = oldCreateSelectionShape.apply(this, args)
      res.isRounded = true
      // style 属性来自 mxShape , mxRectangle 继承自 mxShape
      res.style = {
        arcSize: 6,
      }
      return res
    }
  }

  _setDefaultEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle()
    Object.assign(style, {
      [mxConstants.STYLE_ROUNDED]: true, // 设置线条拐弯处为圆角
      [mxConstants.STYLE_STROKEWIDTH]: '2',
      [mxConstants.STYLE_STROKECOLOR]: '#333333',
      [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#ffa94d',
    })
    this.connectionHandler.createEdgeState = () => {
      const edge = this.createEdge()
      return new mxCellState(this.view, edge, this.getCellStyle(edge))
    }
  }

  _setAnchors() {
    // 禁止从节点中心拖拽出线条
    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.png', 14, 14)

    // this.connectionHandler.isConnectableCell = () => false
    mxEdgeHandler.prototype.isConnectableCell = () => false
    // 重写以定义每个形状的连接点
    // Overridden to define per-shape connection points
    mxGraph.prototype.getAllConnectionConstraints = (terminal) => {
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          if (terminal.shape.stencil != null) {
            return terminal.shape.stencil.constraints
          }
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints
        }
      }

      return null
    }
    // 定义所有形状的默认约束
    mxShape.prototype.constraints = [
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    ]
  }

  /**
   * TODO 暂不清楚功能
   * @private
   */
  _configCustomEvent() {
    const graph = this
    const oldStart = mxEdgeHandler.prototype.start

    mxEdgeHandler.prototype.start = function start(...args) {
      oldStart.apply(this, args)
      graph.fireEvent(new mxEventObject(mxEvent.EDGE_START_MOVE,
        'edge', this.state.cell,
        'source', this.isSource,
      ))

      const oldCreatePreviewShape = mxGraphHandler.prototype.createPreviewShape
      mxGraphHandler.prototype.createPreviewShape = function createPreviewShape(...args) {
        graph.fireEvent(new mxEventObject(mxEvent.VERTEX_START_MOVE))
        return oldCreatePreviewShape.apply(this, args)
      }
    }
  }

  _restoreModel() {
    Object.values(this.getModel().cells)
      .forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.parse(cell.data)
        }
      })
  }

  // 将 data 变为字符串，否则还原时会报错
  _getExportModel() {
    const model = _.cloneDeep(this.getModel())
    Object.values(model.cells)
      .forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.stringify(cell.data)
        }
      })
    return model
  }
}

function genGraph(container) {
  const graph = new Graph(container)
  return graph
}

function dropGraph(evt) {
  const x = mxEvent.getClientX(evt)
  const y = mxEvent.getClientY(evt)
  // 获取 x,y 所在的元素
  const elt = document.elementFromPoint(x, y)
  // 如果鼠标落在graph容器
  if (mxUtils.isAncestorNode(this.container, elt)) {
    return this
  }
  // 鼠标落在其他地方
  return null
}

// drop成功后新建一个节点
function dropSuccessCb(graph, evt, target, x, y) {
  const value = this.element.getAttribute('aside-value')
  const cell = new mxCell(value, new mxGeometry(0, 0, 120, 40))
  cell.vertex = true
  const cells = graph.importCells([cell], x, y, target)
  if (cells != null && cells.length > 0) {
    graph.setSelectionCells(cells)
  }
}

function setCursor(graph) {
  const oldGetCursorForCell = mxGraph.prototype.getCursorForCell
  graph.getCursorForCell = function(...args) {
    const [cell] = args
    return cell.style.includes('normalType')
      ? 'pointer'
      : oldGetCursorForCell.apply(this, args)
  }
}

export {
  genGraph,
  dropGraph,
  dropSuccessCb,
  setCursor
}
