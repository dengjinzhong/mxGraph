<template>
  <div class="graph-container"></div>
</template>

<script>
export default {
  name: 'GraphContainer'
}
</script>

<style lang="scss" scoped>
.graph-container{
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: url('~@/assets/mxgraph/grid.gif') 0 0 repeat;
}
</style>
