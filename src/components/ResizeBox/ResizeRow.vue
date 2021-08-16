<template>
  <div ref="column" class="column">
    <div ref="left" class="column-left" :style="{ width: width + 'px' }">
      <slot name="left" />
      <div ref="resize" class="column-resize" :style="{ width: lineWidth + 'px' }" />
    </div>
    <div ref="right" class="column-right" :style="{ width: `calc(100% - ${width}px)` }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResizeRow',
  props: {
    width: {
      type: Number,
      default: 200
    },
    lineWidth: {
      type: Number,
      default: 5
    },
    minWidth: {
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
      const left = this.$refs.left
      const right = this.$refs.right
      const resize = this.$refs.resize
      const MIN_WIDTH = this.minWidth
      resize.onmousedown = function(e) {
        const startX = e.clientX
        resize.left = resize.offsetLeft
        document.onmousemove = function(e) {
          const endX = e.clientX
          let moveLen = resize.left + (endX - startX)
          const maxT = column.clientWidth - resize.offsetWidth
          if (moveLen < MIN_WIDTH) moveLen = MIN_WIDTH
          if (moveLen > maxT - MIN_WIDTH) moveLen = maxT - MIN_WIDTH

          resize.style.left = moveLen.toString()
          left.style.width = moveLen + 'px'
          right.style.width = (column.clientWidth - moveLen) + 'px'
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
      const left = this.$refs.left
      const right = this.$refs.right
      const moveLen = 20
      left.style.width = moveLen + 'px'
      right.style.width = (column.clientWidth - moveLen) + 'px'
    },
    open() {
      const column = this.$refs.column
      const left = this.$refs.left
      const right = this.$refs.right
      const moveLen = this.width
      left.style.width = moveLen + 'px'
      right.style.width = (column.clientWidth - moveLen) + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.column{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .column-left{
    float: left;
    position: relative;
    width: 200px;
    height: 100%;
    padding-right: 4px;
    .column-resize{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      height:100%;
      width: 5px;
      background: skyblue;
      cursor: w-resize;
      text-align: center;
      &:hover, &:active{
        background: skyblue;
      }
    }
  }
  .column-right{
    float: right;
    height: 100%;
    width: calc(100% - 200px);
    background: inherit;
  }
}
</style>

