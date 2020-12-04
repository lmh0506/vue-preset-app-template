import Vue from 'vue'

import {
  Uploader,
  Toast,
  List,
  Lazyload,
  PullRefresh,
  ImagePreview,
} from 'vant'

Vue.use(Uploader)
  .use(Toast)
  .use(List)
  .use(Lazyload, { loading: '/lazy_img.png' })
  .use(PullRefresh)
  .use(ImagePreview)

Vue.prototype.$imagePreview = ImagePreview
