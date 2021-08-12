import mxgraph from '@/utils/mxgraph'

const {
  mxGraph, mxOutline, mxClient, mxConstants, mxEdgeStyle, mxKeyHandler, mxCompactTreeLayout, mxLayoutManager,
  mxToolbar, mxPrintPreview, mxUtils, mxWindow, mxCellOverlay, mxImage, mxEvent, mxPoint
} = mxgraph

export class Graph extends mxGraph {
  constructor(container) {
    super(container)
    this._init()
  }

  _init() {
    this._setDefaultConfig()
    this._setVertexStyle()
    this._setEdgeStyle()
    this._setLayout()
    // this._mxToolbar()
  }

  _setDefaultConfig() {
    // 允许节点连线
    this.setConnectable(true)
    // 允许在编辑和编辑后自动调整顶点大小
    this.setCellsMovable(false)
    this.setAutoSizeCells(true)
    // 使用鼠标左键平移
    this.setPanning(true)
    // 指定缩放操作是否应该位于实际关系图的中心，而不是从左上角开始。 默认是正确的。
    this.centerZoom = false
    this.panningHandler.useLeftButtonForPanning = true
    // 当用户点击单元格(使用鼠标左键)，但在弹出菜单显示时没有选择单元格时，显示弹出菜单
    this.panningHandler.popupMenuHandler = false
    // //创建outline(导航器，概述)，用于在窗口的右上角移动图形
    const outline = document.createElement('div')
    outline.style = 'z-index:1;position:absolute;overflow:hidden;top:40px;right:40px;width:160px;height:120px;background:transparent;border-style:solid;border-color:lightgray;'
    document.body.appendChild(outline)
    new mxOutline(this, outline)
    // 在触控设备上禁用工具提示
    this.setTooltips(!mxClient.IS_TOUCH)
    // 在输入或转义键时停止编辑
    const keyHandler = new mxKeyHandler(this)

    // 修正了错误的首选尺寸
    const oldGetPreferredSizeForCell = this.getPreferredSizeForCell
    this.getPreferredSizeForCell = function(cell) {
      const result = oldGetPreferredSizeForCell.apply(this, arguments)
      if (result != null) {
        result.width = Math.max(120, result.width - 40)
      }
      return result
    }

    // 将最大文本比例设置为1
    this.cellRenderer.getTextScale = (state) => Math.min(1, state.view.scale)
    // 当我们放大时，动态地向标签添加文本(而不影响新单元格的首选大小  )
    this.cellRenderer.getLabelValue = function(state) {
      let result = state.cell.value
      if (state.view.graph.getModel().isVertex(state.cell)) {
        if (state.view.scale > 1) {
          result += '\nDetails 1'
        }
        if (state.view.scale > 1.3) {
          result += '\nDetails 2'
        }
      }
      return result
    }
  }

  _setVertexStyle() {
    const style = this.getStylesheet().getDefaultVertexStyle()
    Object.assign(style, {
      [mxConstants.STYLE_SHAPE]: 'label', // 定义形状
      [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
      [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_LEFT,
      [mxConstants.STYLE_SPACING_LEFT]: 54,

      [mxConstants.STYLE_GRADIENTCOLOR]: '#7d85df', // 背景渐变色
      [mxConstants.STYLE_STROKECOLOR]: '#7d85df', // 描边颜色
      [mxConstants.STYLE_FILLCOLOR]: '#adc5ff', // 填充颜色

      [mxConstants.STYLE_FONTCOLOR]: '#1d258f', // 字体颜色
      [mxConstants.STYLE_FONTFAMILY]: 'Verdana', // 字体格式
      [mxConstants.STYLE_FONTSIZE]: '12', // 字体大小
      [mxConstants.STYLE_FONTSTYLE]: '1', // 字体倾斜

      [mxConstants.STYLE_SHADOW]: '1', // 图形阴影
      [mxConstants.STYLE_ROUNDED]: '1', // 图形圆角
      [mxConstants.STYLE_GLASS]: '1', // 玻璃样式

      [mxConstants.STYLE_IMAGE]: 'mxgraph/images/dude3.png', // 默认图标图片
      [mxConstants.STYLE_IMAGE_WIDTH]: '48',
      [mxConstants.STYLE_IMAGE_HEIGHT]: '48',
      [mxConstants.STYLE_SPACING]: 8,

    })
  }

  _setEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle()
    Object.assign(style, {
      [mxConstants.STYLE_ROUNDED]: true,
      [mxConstants.STYLE_STROKEWIDTH]: 3,
      [mxConstants.STYLE_EXIT_X]: 0.5, // center
      [mxConstants.STYLE_EXIT_Y]: 1.0, // bottom
      [mxConstants.STYLE_EXIT_PERIMETER]: 0, // disabled
      [mxConstants.STYLE_ENTRY_X]: 0.5, // center
      [mxConstants.STYLE_ENTRY_Y]: 0, // top
      [mxConstants.STYLE_ENTRY_PERIMETER]: 0, // disabled

      // 对于直线，禁用以下选项
      [mxConstants.STYLE_EDGE]: mxEdgeStyle.TopToBottom, // disabled

    })
  }

  _setLayout() {
    const layout = this.layout = new mxCompactTreeLayout(this, false)
    layout.useBoundingBox = false
    layout.edgeRouting = false
    layout.levelDistance = 60
    layout.nodeDistance = 16
    layout.isVertexMovable = () => true

    const layoutMgr = new mxLayoutManager(this)
    layoutMgr.getLayout = (cell) => {
      if (cell.getChildCount() > 0) {
        return layout
      }
    }
  }

  _mxToolbar() {
    const graph = this
    const content = document.createElement('div')
    content.style.padding = '4px'
    const tb = new mxToolbar(content)

    tb.addItem('Zoom In', 'images/zoom_in32.png', function(evt) {
      graph.zoomIn()
    })

    tb.addItem('Zoom Out', 'images/zoom_out32.png', function(evt) {
      graph.zoomOut()
    })

    tb.addItem('Actual Size', 'images/view_1_132.png', function(evt) {
      graph.zoomActual()
    })

    tb.addItem('Print', 'images/print32.png', function(evt) {
      var preview = new mxPrintPreview(graph, 1)
      preview.open()
    })

    tb.addItem('Poster Print', 'images/press32.png', function(evt) {
      var pageCount = mxUtils.prompt('Enter maximum page count', '1')

      if (pageCount != null) {
        var scale = mxUtils.getScaleForPageCount(pageCount, graph)
        var preview = new mxPrintPreview(graph, scale)
        preview.open()
      }
    })

    const wnd = new mxWindow('Tools', content, 0, 0, 200, 66, false)
    wnd.setMaximizable(false)
    wnd.setScrollable(false)
    wnd.setResizable(false)
    wnd.setVisible(true)
  }

  addOverlays(graph, cell, addDeleteIcon) {
    const overlay = new mxCellOverlay(new mxImage('/mxgraph/images/add.png', 24, 24), 'Add child')
    overlay.cursor = 'hand'
    overlay.align = mxConstants.ALIGN_CENTER
    overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
      graph._addChild(graph, cell)
    }))
    graph.addCellOverlay(cell, overlay)
    if (addDeleteIcon) {
      const deleteOverlay = new mxCellOverlay(new mxImage('/mxgraph/images/close.png', 30, 30), 'Delete')
      deleteOverlay.cursor = 'hand'
      deleteOverlay.offset = new mxPoint(-4, 8)
      deleteOverlay.align = mxConstants.ALIGN_RIGHT
      deleteOverlay.verticalAlign = mxConstants.ALIGN_TOP
      deleteOverlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
        graph._deleteSubtree(graph, cell)
      }))
      graph.addCellOverlay(cell, deleteOverlay)
    }
  }

  _addChild(graph, cell) {
    const model = graph.getModel()
    const parent = graph.getDefaultParent()
    let vertex
    model.beginUpdate()
    try {
      vertex = graph.insertVertex(parent, null, 'Double click to set name')
      const geometry = model.getGeometry(vertex)
      const size = graph.getPreferredSizeForCell(vertex)
      geometry.width = size.width
      geometry.height = size.height
      const edge = graph.insertEdge(parent, null, '', cell, vertex)
      edge.geometry.x = 1
      edge.geometry.y = 0
      edge.geometry.offset = new mxPoint(0, -20)
      graph.addOverlays(graph, vertex, true)
    } finally {
      model.endUpdate()
    }
    return vertex
  }
  _deleteSubtree() {}
}

export function initView(container) {
  const graph = new Graph(container)
  const parent = graph.getDefaultParent()
  const model = graph.getModel()
  model.beginUpdate()
  try {
    var w = graph.container.offsetWidth
    var v1 = graph.insertVertex(parent, 'treeRoot',
      'Organization', w / 2 - 30, 20, 140, 60, 'image=mxgraph/images/house.png')
    graph.updateCellSize(v1)
    graph.addOverlays(graph, v1, false)
  } finally {
    model.endUpdate()
  }
  return graph
}
