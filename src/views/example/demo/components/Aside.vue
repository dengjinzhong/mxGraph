<template>
  <ul id="aside" class="al-aside">
    <li aside-value="流程1" draggable="true" @dragstart="dragstart">流程1</li>
    <li aside-value="流程2">流程2</li>
    <li aside-value="流程3">流程3</li>
  </ul>
</template>

<script>
import drag from '@/assets/images/drag.png'
export default {
  name: 'Aside',
  methods: {
    dragstart(ev) {
      console.log('dragstart')
      ev.dataTransfer.setData('text/plain', ev.target.id)
      var img = new Image()
      img.src = drag
      ev.dataTransfer.setDragImage(img, 10, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.al-aside{
  color: #ffffff;
  line-height: 1.6;
}

</style>
