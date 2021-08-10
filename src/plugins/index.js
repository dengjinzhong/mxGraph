import Vue from 'vue'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/icons' // icon

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import GraphContainer from '@/components/mxgraph/GraphContainer'
Vue.component('graph-container', GraphContainer)
