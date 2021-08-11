<template>
  <graph-container ref="graph" />
</template>

<script>
import { Graph } from './graph'
export default {
  name: 'KeyCode',
  data() {
    return {
      graph: {}
    }
  },
  mounted() {
    this.initGraph()
  },
  methods: {
    initGraph() {
      const container = this.$refs.graph.$el
      const graph = this.graph = new Graph(container)
      const parent = graph.getDefaultParent()
      const model = graph.getModel()
      model.beginUpdate()
      try {
        const v1 = graph.insertVertex(parent, '0-1', '流程1', 20, 20, 120, 40)
        const v2 = graph.insertVertex(parent, '0-2', '流程2', 220, 20, 120, 40)
        const e1 = graph.insertEdge(parent, null, '', v1, v2)
      } finally {
        model.endUpdate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
