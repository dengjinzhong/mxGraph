import mxgraph from './index'
import _ from 'lodash'
import drag from '@/assets/images/drag.png'
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
  mxImage,
  mxClient
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
    this._setDefaultConfig() // ??????????????????
    this._configConstituent()
    this._putVertexStyle() // ???????????????
    this._setDefaultEdgeStyle() // ???????????????????????????
    this._setAnchors() // ???????????? hover ????????????
    this._configCustomEvent()
  }

  _setDefaultConfig() {
    // ??????????????????
    this.setConnectable(true)
    // ??????????????????????????????
    mxEvent.disableContextMenu(this.container)
    // ????????????????????????
    this.setCellsResizable(false)
    // ???????????????????????????????????????????????????
    this.setEnterStopsCellEditing(true)
    mxCellEditor.prototype.escapeCancelsEditing = false
    // ?????????????????????
    mxCellEditor.prototype.blurEnabled = true
    // ??????????????????
    this.foldingEnabled = false
    // ???????????????????????????????????????
    this.setHtmlLabels(true)
    // ?????????????????????
    mxGraphHandler.prototype.guidesEnabled = true
    // ??????????????????
    this.setDisconnectOnMove(false)
    this.setAllowDanglingEdges(false)
    mxGraph.prototype.isCellMovable = cell => !cell.edge

    // ???????????????????????????
    this.setCellsBendable(false)

    // ????????????label??????????????????
    mxGraph.prototype.edgeLabelsMovable = false
  }
  /* TODO ??????????????????????????? */
  _configConstituent() {
    // ???????????????????????????
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
    // ???????????????????????????
    // Redirects start drag to parent
    const graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent
    mxGraphHandler.prototype.getInitialCellForEvent = function getInitialCellForEvent(...args) {
      // this ??? mxGraphHandler
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
      // ??????????????????????????????
      // https://github.com/jinzhanye/mxgraph-demos/blob/master/src/06.image.html
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LABEL,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
      [mxConstants.STYLE_ROUNDED]: true,
      [mxConstants.STYLE_ARCSIZE]: 6, // ??????????????????

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

    // ????????????????????????????????????????????????????????????
    const oldCreateSelectionShape = mxVertexHandler.prototype.createSelectionShape
    mxVertexHandler.prototype.createSelectionShape = function createSelectionShape(...args) {
      const res = oldCreateSelectionShape.apply(this, args)
      res.isRounded = true
      // style ???????????? mxShape , mxRectangle ????????? mxShape
      res.style = {
        arcSize: 6,
      }
      return res
    }
  }

  _setDefaultEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle()
    Object.assign(style, {
      [mxConstants.STYLE_ROUNDED]: true, // ??????????????????????????????
      [mxConstants.STYLE_STROKEWIDTH]: '2',
      [mxConstants.STYLE_STROKECOLOR]: '#333333',
      [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#ffa94d',
      [mxConstants.STYLE_EXIT_X]: 1, // center ??????
      [mxConstants.STYLE_EXIT_Y]: 0.5, // bottom
      [mxConstants.STYLE_ENTRY_X]: 0, // center ??????
      [mxConstants.STYLE_ENTRY_Y]: 0.5, // top
    })
    this.connectionHandler.createEdgeState = () => {
      const edge = this.createEdge()
      return new mxCellState(this.view, edge, this.getCellStyle(edge))
    }
  }

  _setAnchors() {
    // ????????????????????????????????????
    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.png', 14, 14)

    // this.connectionHandler.isConnectableCell = () => false
    mxEdgeHandler.prototype.isConnectableCell = () => false
    // ???????????????????????????????????????
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
    // ?????????????????????????????????
    mxShape.prototype.constraints = [
      new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    ]
  }

  /**
   * TODO ??????????????????
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

  // ??? data ??????????????????????????????????????????
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
  // ?????? x,y ???????????????
  const elt = document.elementFromPoint(x, y)
  // ??????????????????graph??????
  if (mxUtils.isAncestorNode(this.container, elt)) {
    return this
  }
  // ????????????????????????
  return null
}

// drop???????????????????????????
function dropSuccessCb(graph, evt, target, x, y) {
  console.log(evt.dataTransfer)
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
  setCursor,
}
