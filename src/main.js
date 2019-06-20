// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Viewer from 'v-viewer'

import Element from 'element-ui' // 引入element ui
import 'element-ui/lib/theme-chalk/index.css' // 引入 element ui 样式
import 'viewerjs/dist/viewer.css' // 引入 v-viewer 样式
import 'video.js/dist/video-js.css' // 引入视频播放器样式
import 'vue-video-player/src/custom-theme.css' // 引入视频播放器样式
import '@/../static/theme.css'                // 自定义样式文件 播放button按钮

Vue.config.productionTip = false
Vue.use(Element, {
  size: 'mini' // set element-ui default size
})

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 4,
      reset: 4,
      rotateLeft: 4,
      rotateRight: 4,
      flipHorizontal: 4,
      flipVertical: 4
    }
  }
}) // 使用图片预览
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
