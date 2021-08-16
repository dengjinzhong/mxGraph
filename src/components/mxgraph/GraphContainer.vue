<template>
  <div class="graph-container" @click="$emit('graphClick')" />
</template>

<script>
export default {
  name: 'GraphContainer',
  methods: {
    drop_handler(ev) {
      console.log('dragOver')
      console.log(ev)
      ev.preventDefault()
    },
    drop(ev) {
      ev.preventDefault()
      // 获取拖放目标的id数据
      var data = ev.dataTransfer.getData('text')
      console.log(data)
    }
  }
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
