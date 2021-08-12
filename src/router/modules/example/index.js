/* 官方示例 */

export default (Layout) => ({
  path: '/example',
  component: Layout,
  redirect: '/anchors',
  meta: { title: '例子', icon: 'dashboard' },
  children: [
    {
      path: 'anchors',
      name: 'Anchors',
      component: () => import('@/views/example/anchors'),
      meta: { title: 'hover效果', icon: 'dashboard' }
    },
    {
      path: 'editor',
      name: 'Editor',
      component: () => import('@/views/example/demo'),
      meta: { title: '编辑器', icon: 'dashboard' }
    },
    {
      path: 'keyCode',
      name: 'KeyCode',
      component: () => import('@/views/example/keyCode'),
      meta: { title: '键盘事件', icon: 'dashboard' }
    },
    {
      path: 'edgeStyle',
      name: 'EdgeStyle',
      component: () => import('@/views/example/edgeStyle'),
      meta: { title: '连接线样式', icon: 'dashboard' }
    },
    {
      path: 'export',
      name: 'Export',
      component: () => import('@/views/example/export'),
      meta: { title: '导入导出', icon: 'dashboard' }
    },
    {
      path: 'layout',
      name: 'Layout',
      component: () => import('@/views/example/layout'),
      meta: { title: '布局', icon: 'dashboard' }
    },
    {
      path: 'layoutStyle',
      name: 'LayoutStyle',
      component: () => import('@/views/example/layoutStyle'),
      meta: { title: '样式布局', icon: 'dashboard' }
    },
    {
      path: 'autoLayout',
      name: 'AutoLayout',
      component: () => import('@/views/example/autoLayout'),
      meta: { title: '自动布局', icon: 'dashboard' }
    },
    {
      path: 'Orgchart',
      name: 'Orgchart',
      component: () => import('@/views/example/Orgchart'),
      meta: { title: '组织结构图', icon: 'dashboard' }
    }
  ]
})
