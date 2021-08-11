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
    }
  ]
})
