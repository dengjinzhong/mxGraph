import mx from 'mxgraph'

const mxgraph = mx({
  mxBasePath: '../mxgraph',
})
const { mxGraph, mxGraphModel, mxEditor, mxGeometry, mxDefaultKeyHandler,
  mxStylesheet, mxDefaultToolbar
} = mxgraph

// fix BUG https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxGraph
window.mxGraphModel = mxGraphModel
window.mxEditor = mxEditor
window.mxGeometry = mxGeometry
window.mxDefaultKeyHandler = mxDefaultKeyHandler
window.mxStylesheet = mxStylesheet
window.mxDefaultToolbar = mxDefaultToolbar

export default mxgraph
