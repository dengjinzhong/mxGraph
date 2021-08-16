<template>
  <resize-row>
    <template v-slot:left>
      <graph-tree ref="graphTree" @handleNodeClick="handleNodeClick" />
    </template>
    <template>
      <resize-col>
        <graph-container ref="graph" />
      </resize-col>
    </template>
  </resize-row>
</template>

<script>
import ResizeRow from '@/components/ResizeBox/ResizeRow'
import ResizeCol from '@/components/ResizeBox/ResizeCol'
import GraphTree from './components/GraphTree'
import { initView } from './graph'

export default {
  name: 'AutoLayout',
  components: {
    ResizeRow, GraphTree, ResizeCol
  },
  data() {
    return {
      graph: {}
    }
  },
  mounted() {
    this.initGraph()
    console.log(this.$refs.graphTree.$refs.tree)
  },
  methods: {
    initGraph() {
      const container = this.$refs.graph.$el
      const drag = this.$refs.graphTree.$el
      this.graph = initView(container)
      this.graph.makeDraggable(drag)
    },
    handleNodeClick(data) {
      this.graph.setDragData(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.graph{
  height: 100%;
  overflow: hidden;
  .graph-tree{
    width: 200px;
  }
}
</style>
