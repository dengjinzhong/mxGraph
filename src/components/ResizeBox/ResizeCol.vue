<template>
  <div ref="column" class="column">
    <div ref="top" class="column-top" :style="{ height: `calc(100% - ${height}px)` }">
      <slot />
      <div ref="resize" class="column-resize" :style="{ height: lineHeight + 'px' }" />
    </div>
    <div ref="down" class="column-down" :style="{ height: height + 'px' }">
      <slot name="top" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResizeCol',
  props: {
    height: {
      type: Number,
      default: 200
    },
    lineHeight: {
      type: Number,
      default: 5
    },
    minHeight: {
      type: Number,
      default: 50
    }
  },
  mounted() {
    this.initResize()
  },
  methods: {
    initResize() {
      const column = this.$refs.column
      const top = this.$refs.top
      const resize = this.$refs.resize
      const down = this.$refs.down
      resize.onmousedown = function(e) {
        const startY = e.clientY
        resize.top = resize.offsetTop
        document.onmousemove = function(e) {
          const endY = e.clientY
          let moveLen = resize.top + (endY - startY)
          const maxT = column.clientHeight - resize.offsetHeight
          if (moveLen < 30) moveLen = 30
          if (moveLen > maxT - 30) moveLen = maxT - 30
          resize.style.top = moveLen.toString()
          top.style.height = moveLen + 'px'
          down.style.height = (column.clientHeight - moveLen) + 'px'
        }
        document.onmouseup = function(evt) {
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
    },
    close() {
      const column = this.$refs.column
      const top = this.$refs.top
      const down = this.$refs.down
      const moveLen = 20
      down.style.height = moveLen + 'px'
      top.style.height = (column.clientHeight - moveLen) + 'px'
    },
    open() {
      const column = this.$refs.column
      const top = this.$refs.top
      const down = this.$refs.down
      const moveLen = this.height
      down.style.height = moveLen + 'px'
      top.style.height = (column.clientHeight - moveLen) + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.column{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .column-top{
    position: relative;
    height: calc(100% - 200px);
    width: 100%;
    padding-bottom: 3px;
    overflow: hidden;
    .column-resize{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 5px;
      background: skyblue;
      cursor: s-resize;
      &:hover, &:active{
        background: skyblue;
      }
    }
  }
  .column-down{
    height: 200px;
    width: 100%;
    overflow: hidden;
    background: inherit;
  }
}
</style>
