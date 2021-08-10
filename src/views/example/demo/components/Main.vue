<template>
  <div style="height: 100%">
    <graph-container ref="GraphContainer" />
    <div class="outline-wrapper">
      <h4>导航器</h4>
      <div ref="GraphOutline" class="graph-outline" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
}
</script>

<style lang="scss" scoped>
.outline-wrapper {
  border: 1px solid #dedede;
  background: #fff;
  position: fixed;
  right: 262px;
  top: 66px;
  border-radius: 4px;
  z-index: 10;
  > h4 {
    padding: 6px;
    font-size: 12px;
    border-bottom: 1px solid #e6e6e6;
  }
  .graph-outline {
    width: 200px;
  }
}
</style>
