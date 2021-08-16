<template>
  <div class="graph-tree">
    <el-tree
      ref="tree"
      :load-node="loadNode"
      :default-props="defaultProps"
      @handleNodeClick="$emit('handleNodeClick', $event)"
    />
  </div>
</template>

<script>
import ElTree from '@/components/element-ui/tree'
export default {
  name: 'GraphTree',
  components: {
    ElTree
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 3) return resolve([])

      setTimeout(() => {
        const data = [{
          name: 'leaf',
          leaf: true
        }, {
          name: 'zone'
        }]

        resolve(data)
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.graph-tree{
  height: 100%;
  background: #fff;
  position: relative;
  padding: 10px;
}
</style>
