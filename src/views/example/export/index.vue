<template>
  <div>
    <div class="header">
      <input
        ref="file"
        class="hide"
        type="file"
        @change="fileChange"
      >
      <el-button type="primary" @click="importFile">导入</el-button>
      <el-button type="primary" @click="exportFile">导出</el-button>
    </div>
    <graph-container ref="graph" />
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { initView } from './graph'
export default {
  name: 'Export',
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
    exportFile() {
      const xml = this.graph.exportModelXML()
      const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, 'pocket_monster.xml')
    },
    importFile() {
      this.$refs.file.click()
    },
    fileChange(evt) {
      const file = evt.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const txt = e.target.result
        this.graph.importModelXML(txt)
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  margin: 20px;
}
.hide{
  display: none;
}
</style>
