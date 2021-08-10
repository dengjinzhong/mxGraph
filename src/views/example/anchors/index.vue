<template>
  <graph-container ref="GraphContainer" />
</template>

<script>
import mxgraph from '@/utils/mxgraph'

const {
  mxGraph, mxShape, mxConnectionConstraint,
  mxPoint, mxPolyline, mxClient, mxUtils, mxEvent,
  mxCellState, mxRubberband
} = mxgraph

export default {
  name: 'Anchors',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initSetting()
      if (!mxClient.isBrowserSupported()) {
        // 如果不支持浏览器，则显示错误消息
        mxUtils.error('浏览器不支持!', 200, false)
      } else {
        const container = this.$refs.GraphContainer.$el
        // 禁用内置上下文菜单
        mxEvent.disableContextMenu(container)
        // 在给定的容器内创建图形
        const graph = new mxGraph(container)
        graph.setConnectable(true)
        // 启用默认边缘样式的连接预览
        graph.connectionHandler.createEdgeState = function(me) {
          const edge = graph.createEdge(null, null, null, null, null)
          return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge))
        }
        // 指定默认的边缘样式
        graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle'
        // 使橡皮带选择
        new mxRubberband(graph)
        // 获取用于插入新单元格的默认父类。 这
        // 通常是根结点的第一个子结点。 层0)
        const parent = graph.getDefaultParent()
        // 在单个步骤中将单元格添加到模型中
        graph.getModel().beginUpdate()

        try {
          const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30)
          const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30)
          const e1 = graph.insertEdge(parent, null, '', v1, v2)
        } finally {
          // 更新显示
          graph.getModel().endUpdate()
        }
      }
    },
    initSetting() {
      // 重写以定义每个形状的连接点
      mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
        return terminal?.shape?.stencil?.constraints || terminal?.shape?.constraints || null
      }
      const mxShapeList = [
        { x: '0.25', y: '0' },
        { x: '0.5', y: '0' },
        { x: '0.75', y: '0' },
        { x: '0', y: '0.25' },
        { x: '0', y: '0.5' },
        { x: '0', y: '0.75' },
        { x: '1', y: '0.25' },
        { x: '1', y: '0.5' },
        { x: '1', y: '0.75' },
        { x: '0.25', y: '1' },
        { x: '0.5', y: '1' },
        { x: '0.75', y: '1' },
      ]
      // 定义所有形状的默认约束
      mxShape.prototype.constraints = mxShapeList.map(({ x, y }) => new mxConnectionConstraint(new mxPoint(x, y), true))
      // 边没有连接点
      mxPolyline.prototype.constraints = null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
