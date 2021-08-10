<template>
  <graph-container ref="GraphContainer" />
</template>

<script>
import mxgraph from '@/utils/mxgraph'
const {
  mxClient, mxUtils, mxEvent,
  mxGraph, mxRubberband
} = mxgraph
export default {
  name: 'Dashboard',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false)
      } else {
        const container = this.$refs.GraphContainer.$el
        // 禁用图层右键菜单
        mxEvent.disableContextMenu(container)
        const graph = new mxGraph(container)
        const parent = graph.getDefaultParent()
        graph.getModel().beginUpdate()
        try {
          const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30)
          const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30)
          const e1 = graph.insertEdge(parent, null, '', v1, v2)
        } finally {
          graph.getModel().endUpdate()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
