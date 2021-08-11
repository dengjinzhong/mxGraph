import mx from 'mxgraph'

const mxgraph = mx({
  mxBasePath: '../mxgraph',
})

const {
  mxGraph, mxUndoManager, mxEvent, mxKeyHandler
} = mxgraph

export class Graph extends mxGraph {
  constructor(container) {
    super(container)
    this._init()
  }

  /**
   * 键盘事件监听
   * 上下左右移动选中目标物
   * @private
   */
  _keyHandler() {
    const $vm = this
    this.container.focus()
    const keyHandler = new mxKeyHandler(this)
    keyHandler.bindKey(37, function() { $vm.nudge(37) }) // Left Arrow
    keyHandler.bindKey(38, function() { $vm.nudge(38) }) // Up Arrow
    keyHandler.bindKey(39, function() { $vm.nudge(39) }) // Right Arrow
    keyHandler.bindKey(40, function() { $vm.nudge(40) }) // Dw Arrow

    keyHandler.bindControlKey(67, function() { $vm.copyCell() }) // C
    keyHandler.bindControlKey(86, function() { $vm.pasteCell() }) // V

    keyHandler.bindKey(115, function() { $vm.undoMng.redo() }) // F4
    keyHandler.bindControlKey(89, function() { $vm.undoMng.redo() }) // Y
    keyHandler.bindControlKey(90, function() { $vm.undoMng.undo() }) // Z

    keyHandler.bindControlKey(68, function() { $vm.delCell() }) // D
    keyHandler.bindKey(8, function() { $vm.delCell() }) // BackSpace
  }

  /**
   * 撤销与重做
   * @private
   */
  _mxUndoManager() {
    const undoMng = this.undoMng = new mxUndoManager()
    const listener = function(sender, evt) {
      undoMng.undoableEditHappened(evt.getProperty('edit'))
    }
    this.getModel().addListener(mxEvent.UNDO, listener)
    this.getView().addListener(mxEvent.UNDO, listener)
  }

  _init() {
    this._keyHandler()
    this._mxUndoManager()
  }

  nudge(keyCode) {
    if (!this.isSelectionEmpty()) {
      let dx = 0; let dy = 0
      switch (keyCode) {
        case 37: dx = -1; break
        case 38: dy = -1; break
        case 39: dx = 1; break
        case 40: dy = 1; break
        default: break
      }
      this.moveCells(this.getSelectionCells(), dx, dy)
    }
  }

  copyCell() {
    if (!this.isSelectionEmpty()) {
      mxgraph.mxClipboard.copy(this, this.getSelectionCells())
    }
  }

  pasteCell() {
    mxgraph.mxClipboard.paste(this)
  }

  delCell() {
    if (!this.isSelectionEmpty()) {
      this.removeCells(this.getSelectionCells())
    }
  }
}
