<template>
  <div class="al-header">
    <input
      ref="importInput"
      class="hide"
      type="file"
      @change="$emit('buttonClick','readFile', $event)"
    >
    <el-button v-bind="btnConfig" @click="$emit('buttonClick','import')">导入</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'export')">导出</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'print')">输出XML</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'redo')">重做</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'undo')">撤销</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'print')">输出XML</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'layout')">自动布局</el-button>
    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'delete')">删除</el-button>
    <!--    <el-button v-bind="btnConfig" @click="$emit('buttonClick', 'exportImage')">导出图片</el-button>-->
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      btnConfig: {
        type: 'primary',
        size: 'mini'
      }
    }
  },
  methods: {
    buttonClick(prop) {}
  }
}
</script>

<style lang="scss" scoped>
.al-header{
  display: flex;
  align-items: center;
  height: 100%;
}
.hide{
  display: none !important;
}
</style>
