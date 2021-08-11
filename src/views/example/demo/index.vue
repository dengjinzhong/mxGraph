<template>
  <el-container class="mxgraph-editor">
    <el-header>
      <al-header ref="header" @buttonClick="buttonClick" />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <al-aside ref="aside" />
      </el-aside>
      <el-container>
        <el-main>
          <al-main ref="main" />
        </el-main>
        <el-footer>
          <al-footer />
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import AlHeader from './components/Header'
import AlAside from './components/Aside'
import AlMain from './components/Main'
import AlFooter from './components/Footer'

import _ from 'lodash'
import FileSaver from 'file-saver'

import { Graph, genGraph, dropGraph, dropSuccessCb, setCursor, addScrollListener, wheelHandle } from '@/utils/mxgraph/Graph'
import mxgraph from '@/utils/mxgraph'
const { mxOutline, mxUtils, mxDragSource, mxEvent, mxUndoManager,
  mxCompactTreeLayout, mxParallelEdgeLayout, mxRadialTreeLayout, mxStackLayout,
  mxCircleLayout, mxPartitionLayout, mxFastOrganicLayout, mxEdgeLabelLayout,
  mxCompositeLayout, mxClipboard, mxConnectionHandler, mxImage, mxKeyHandler, mxCellOverlay, mxPoint
} = mxgraph
export default {
  name: 'MxGraphEditor',
  components: {
    AlHeader,
    AlAside,
    AlMain,
    AlFooter
  },
  data() {
    return {
      graph: {},
      selectEdge: null,
      selectVertex: null,
      undoMng: {},
      cellMap: []
    }
  },
  mounted() {
    this.initGraph()
    this.makeDraggable()
  },
  methods: {
    initGraph() {
      const main = this.$refs.main
      const container = main.$refs.GraphContainer.$el
      const graph = genGraph(container)
      this.graph = graph
      // 绘制导航
      const outline = new mxOutline(graph, main.$refs.GraphOutline)

      setCursor(graph)
      const layout = new mxCompactTreeLayout(graph)

      this._listenEvent()
      this._keyHandler()
      // this._MouseListener()
      this._mxUndoManager()
      this._factoryMethod()

      const parent = graph.getDefaultParent()
      graph.getModel().beginUpdate()
      try {
        // const v1 = graph.insertVertex(parent, '0-1', '流程1', 20, 20, 120, 40)
        // const v2 = graph.insertVertex(parent, '0-2', '流程2', 200, 150, 120, 40)
        // console.log(v1, v2)
        // const v3 = graph.insertVertex(parent, null, '流程3', 400, 150, 120, 40)
        // const v4 = graph.insertVertex(parent, null, '流程4', 600, 150, 120, 40)
        // const v5 = graph.insertVertex(parent, null, '流程5', 700, 150, 120, 40)
        // const v6 = graph.insertVertex(parent, null, '流程6', 800, 150, 120, 40)
        // const v7 = graph.insertVertex(parent, null, '流程7', 800, 150, 120, 40)
        // const e1 = graph.insertEdge(parent, null, '', v1, v2)
        // const e2 = graph.insertEdge(parent, null, '', v1, v3)
        // const e3 = graph.insertEdge(parent, null, '', v2, v4)
        // const e6 = graph.insertEdge(parent, null, '', v3, v4)
        // const e4 = graph.insertEdge(parent, null, '', v4, v5)
        // const e5 = graph.insertEdge(parent, null, '', v4, v6)
        // layout.execute(graph.getDefaultParent())
      } finally {
        graph.getModel().endUpdate()
      }
    },
    makeDraggable() {
      const asideItemDom = this.$refs.aside.$el.childNodes
      const graph = this.graph
      const dragElt = document.createElement('div')
      dragElt.style.border = 'dashed black 1px'
      dragElt.style.width = '120px'
      dragElt.style.height = '40px'
      asideItemDom.forEach(dom => {
        const ds = mxUtils.makeDraggable(dom, dropGraph.bind(graph), dropSuccessCb, dragElt, null, null, graph.autoscroll, true)
        // 恢复原来的拖拽图标，而在图形之外
        ds.createDragElement = mxDragSource.prototype.createDragElement
      })
    },
    handleSelectionChange(selectModel) {
      this.selectVertex = {}
      this.selectEdge = {}
      if (!selectModel.cells.length) {
        return
      }
      const cell = selectModel.cells[0]

      if (cell.vertex) {
        this.selectVertex = cell
      } else {
        this.selectEdge = cell
      }
    },
    _listenEvent() {
      const graph = this.graph
      // 监听 mxGraph 事件
      const mxGraphSelectionModel = graph.getSelectionModel()
      mxGraphSelectionModel.addListener(mxEvent.CHANGE, this.handleSelectionChange)

      const vm = this
      graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
        const cell = evt.properties.cells[0]
        const position = Graph.getCellPosition(cell)
        console.log(`节点被移动到 ${JSON.stringify(position)}`)
      })

      graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
        const cell = evt.properties.cells[0]
        if (graph.isPart(cell)) {
          return
        }

        if (cell.vertex) {
          console.log('添加了一个节点')
        } else if (cell.edge) {
          console.log('添加了一条线')
        }
      })

      graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
        console.log(`内容改变为：${evt.getProperty('value')}`)
      })

      graph.addListener(mxEvent.CONNECT_CELL, (sender, evt) => {
        console.log('改变了连线')
      })

      graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
        const cell = evt.getProperty('cell')
        console.log('我双击了单元格' + cell.value)
      })
    },
    _MouseListener() {
      const graph = this.graph
      graph.addMouseListener({
        mouseDown(sender, me) {
        },
        mouseMove(graph, event) {
          const cell = event.getCell()
          if (cell && cell.overlays) {
            console.log(cell.overlays)
          }
        },
        mouseUp() {},
        dragEnter() {},
        dragLeave() {},
      })
    },
    _keyHandler() {
      const $vm = this
      const graph = this.graph
      this.graph.container.focus()
      const keyHandler = new mxKeyHandler(this.graph)
      function nudge(keyCode) {
        if (!graph.isSelectionEmpty()) {
          let dx = 0; let dy = 0
          switch (keyCode) {
            case 37: dx = -1; break
            case 38: dy = -1; break
            case 39: dx = 1; break
            case 40: dy = 1; break
            default: break
          }
          graph.moveCells(graph.getSelectionCells(), dx, dy)
        }
      }
      keyHandler.bindKey(37, function() { nudge(37) }) // Left Arrow
      keyHandler.bindKey(38, function() { nudge(38) }) // Up Arrow
      keyHandler.bindKey(39, function() { nudge(39) }) // Right Arrow
      keyHandler.bindKey(40, function() { nudge(40) }) // Dw Arrow
      keyHandler.bindKey(8, function() { $vm.del() }) // BackSpace
      keyHandler.bindControlKey(68, function() { $vm.del() }) // D
      keyHandler.bindControlKey(67, function() {
        if (!_.isEmpty($vm.selectVertex)) {
          mxClipboard.copy(graph, [$vm.selectVertex])
        }
      }) // C
      keyHandler.bindControlKey(86, function() { mxClipboard.paste(graph) }) // V
      keyHandler.bindControlKey(90, function() { $vm.undoMng.undo() }) // Z
      keyHandler.bindControlKey(89, function() { $vm.undoMng.redo() }) // Y
      keyHandler.bindControlKey(82, function() { $vm.circleLayout() }) // R
      keyHandler.bindKey(115, function() { $vm.undoMng.redo() }) // F4
    },
    _mxUndoManager() {
      const graph = this.graph
      const undoMng = new mxUndoManager()
      this.undoMng = undoMng
      const listener = function(sender, evt) {
        undoMng.undoableEditHappened(evt.getProperty('edit'))
      }
      graph.getModel().addListener(mxEvent.UNDO, listener)
      graph.getView().addListener(mxEvent.UNDO, listener)
    },
    _factoryMethod() {
      const graph = this.graph
      const undoMng = this.undoMng
      graph.popupMenuHandler.autoExpand = true
      graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
        const canUndo = undoMng.canUndo()
        const canRedo = undoMng.canRedo()
        const isSelectCells = !mxClipboard.isEmpty()
        if (cell) {
          console.log(cell, cell.isEdge)
          if (cell.isVertex()) {
            menu.addItem('删除', null, () => {
              graph.deleteSubtree(cell)
            })
            menu.addItem('复制', null, () => {
              this.$message('我要复制')
              mxClipboard.copy(graph, [cell])
            })
            menu.addItem('编辑', null, () => {
              this.$message('我要编辑')
            })
            menu.addSeparator()
            menu.addItem('预览数据', null, () => {
              this.$message('预览数据')
            }, null, null, false)
            menu.addSeparator()
            menu.addItem('运行到', null, () => {
              this.$message('运行到')
            })
          } else if (cell.isEdge()) {
            menu.addItem('删除', null, () => {
              graph.removeCells([cell])
            })
          }
        } else {
          menu.addItem('撤销', null, () => {
            undoMng.undo()
          }, null, null, canUndo)
          menu.addItem('重做', null, () => {
            undoMng.redo()
          }, null, null, canRedo)
          menu.addSeparator()
          menu.addItem('粘贴', null, () => {
            if (isSelectCells) {
              mxClipboard.paste(graph)
            }
          }, null, null, isSelectCells)
          menu.addItem('复制', null, () => {
          }, null, null, false)
          menu.addSeparator()
          menu.addItem('显示名称/标题', null, () => {
            graph.removeCells([cell])
          })
        }
        //
      }
    },
    buttonClick(prop, event) {
      switch (prop) {
        case 'import':
          this.importFile()
          break
        case 'readFile':
          this.readFile(event)
          break
        case 'export':
          this.exportFile()
          break
        case 'print':
          this.logXML()
          break
        case 'undo':
          this.undoMng.undo()
          break
        case 'redo':
          this.undoMng.redo()
          break
        case 'delete':
          this.del()
          break
        case 'layout':
          this.circleLayout()
          break
        case 'select':
          this.selectCell()
          break
        case 'check':
          this.checkCell()
          break
        default:
          console.log(prop)
          return
      }
    },
    importFile() {
      this.$refs.header.$refs.importInput.click()
    },
    readFile(evt) {
      const file = evt.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const txt = e.target.result
        this.graph.importModelXML(txt)
      }
      reader.readAsText(file)
    },
    selectCell() {
      const graph = this.graph
      const model = graph.getModel()
      const cell = model.getCell('0-1')
      console.log(cell)
      graph.setSelectionCell(cell)
    },
    checkCell() {
      const graph = this.graph
      const model = graph.getModel()
      const cell = model.getCell('0-1')
      const overlay = new mxCellOverlay(new mxImage('mxgraph/images/check.png', 16, 16), '组件应该有且仅有一个输入组件')
      overlay.offset = new mxPoint(0, -40)
      overlay.cursor = 'default'
      graph.addCellOverlay(cell, overlay)
    },
    exportFile() {
      const xml = this.graph.exportModelXML()
      const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, 'pocket_monster.xml')
    },
    logXML() {
      this.$message.info('已经输出，请在控制台查看')
      const xml = this.graph.exportModelXML()
      console.log(xml)
      console.log('mode:', this.graph.getModel())
    },
    del() {
      if (!_.isEmpty(this.selectVertex)) {
        this.graph.deleteSubtree(this.selectVertex)
      } else {
        this.graph.removeCells([this.selectEdge])
      }
    },
    circleLayout() {
      const graph = this.graph
      graph.getModel().beginUpdate()
      try {
        // const circleLayout = new mxCircleLayout(graph)
        // const parent = graph.getDefaultParent()
        // circleLayout.execute(parent)

        // const layout = new mxCompactTreeLayout(graph)
        // layout.execute(graph.getDefaultParent())

        // var layout = new mxParallelEdgeLayout(graph)
        // layout.execute(graph.getDefaultParent())

        // var layout = new mxRadialTreeLayout(graph)
        // layout.execute(graph.getDefaultParent())

        const layout = new mxCompactTreeLayout(graph)
        layout.execute(graph.getDefaultParent())
      } finally {
        graph.getModel().endUpdate()
        // if (animate.checked) {
        //   var morph = new mxMorphing(graph)
        //   morph.addListener(mxEvent.DONE, function() {
        //     graph.getModel().endUpdate()
        //   })
        //
        //   morph.startAnimation()
        // } else {
        //   graph.getModel().endUpdate()
        // }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.mxgraph-editor{
  height: 100%;
}
.el-container{
  .el-header{
    background: green;
  }
  .el-aside{
    background: blue;
  }
  .el-main{
    padding: 0;
  }
  .el-footer{
    background: black;
  }
}
</style>
