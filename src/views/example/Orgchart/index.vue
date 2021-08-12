<template>
  <graph-container ref="graph" />
</template>

<script>
import { initView } from './graph'

export default {
  name: 'Orgchart',
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
