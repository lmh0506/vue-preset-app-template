export default {
  data () {
    return {
      fileMaxSize: 5 * 1024 * 1024, // 5M  文件大小
      fileMaxCount: 3, // 最大文件总数
      progressSize: 65 // 进度条大小
    }
  },
  methods: {
    beforeRead (file) {
      if (file.type.indexOf('image') === -1) {
        this.$toast('图片格式有误')
        return false
      }

      return true
    },
    oversize (file) {
      let size = this.fileMaxSize / 1024 / 1024
      this.$toast(`文件大小不能超过${size}M`)
    }
  }
}
