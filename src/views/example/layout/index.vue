<template>
  <div>
    <el-button @click="resetLayout">重置布局</el-button>
    <graph-container ref="graph" />
  </div>
</template>

<script>
import { initView } from './graph'

export default {
  name: 'TreeLayout',
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
      this.graph = initView(container)
    },
    resetLayout() {
      this.graph.resetLayout()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
