<template>
  <van-uploader
    ref="uploader"
    class="my-upload-wrapper"
    v-bind="$props"
    v-on="$listeners"
    :fileList="fileList"
    :before-delete="handleBeforeDelete"
    :after-read="handleAfterRead">
    <slot></slot>
    <template #preview-cover="file">
      <slot :file="file" name="preview-cover"></slot>
    </template>
  </van-uploader>
</template>

<script>
import axios from 'axios'
import { FILE_UPLOAD } from '@/configs/config'
import EXIF from '@/utils/smallExif'
import { mapState } from 'vuex'
import { Uploader } from 'vant'
export default {
  name: 'MyUpload',
  props: {
    ...Uploader.props,
    fileList: { // 已上传的文件列表
      type: Array,
      default () {
        return []
      }
    },
    fileName: { // 上传文件时文件的参数名
      type: String,
      default: 'file'
    },
    data: { // 上传需要附加数据
      type: Object,
      default () {
        return {}
      }
    },
    timeout: { // 上传超时时间
      type: Number,
      default: 60000
    },
    // 压缩质量
    compressQuality: {
      type: Number,
      default: 0.8
    }
  },
  watch: {
    fileList (val) {
      this.$emit('update:fileList', val)
    }
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    // 文件添加后
    // eslint-disable-next-line no-unused-vars
    handleAfterRead ({ file, content }) {
      const id = new Date().getTime()
      const source = axios.CancelToken.source()

      file = this.compressImage(file, async file => {
        this.fileList.push({
          file,
          url: content,
          id,
          source,
          status: 'uploading',
          message: '上传中...'
        })

        const data = new FormData()
        // formData.append第三个参数filename是有浏览器兼容性问题的，如果不传就是filename=blob，后端校验文件名可能过不去
        data.append(this.fileName, file, file.name)
        for (const key in this.data) {
          data.append(key, this.data[key])
        }

        try {
          const res = await axios({
            method: 'post',
            url: FILE_UPLOAD,
            data,
            timeout: this.timeout,
            headers: {
              'Content-Type': 'multipart/form-data',
              accessToken: this.token
            },
            cancelToken: source.token // 这里声明的cancelToken其实相当于是一个标记
          })

          const index = this.getFileIndex(id)
          if (res.data.success) {
            this.$set(this.fileList[index], 'status', 'done')
            this.$set(this.fileList[index], 'url', res.data.data.fileUrl)
            this.$emit('uploadSuccess', res.data.data, res.data, index)
          } else {
            this.$set(this.fileList[index], 'status', 'failed')
            this.$set(this.fileList[index], 'message', '上传出错了')
            this.$emit('uploadFail', res.data, index)
          }
        } catch (e) {
          console.log(e)
          if (axios.isCancel(e)) {
            this.$toast('取消上传')
          } else if (e.code === 'ECONNABORTED' && e.message.indexOf('timeout') !== -1) {
            this.$toast('请求超时')
            const index = this.getFileIndex(id)
            this.fileList.splice(index, 1)
          } else {
            const index = this.getFileIndex(id)
            this.fileList.splice(index, 1)
            this.$toast.fail('网络波动，请重新上传！')
          }
        }
      })
    },
    // 删除文件
    handleBeforeDelete (file) {
      const index = this.fileList.findIndex(item => item === file)
      const source = this.fileList[index].source
      source && source.cancel('取消上传')
      // 删除 上传成功或者是已上传的文件时
      if (this.fileList[index].status === 'done' || !source) {
        this.$emit('deleteFile', index, this.fileList[index])
      }
      this.fileList.splice(index, 1)
    },
    // 获取文件下标
    getFileIndex (id) {
      return this.fileList.findIndex(file => file.id === id)
    },
    // 检测是否全部上传完成
    checkAllUploaded () {
      const noUpload = this.fileList.find(item => item.status !== 'done')
      return !noUpload
    },
    // 清除上传的文件
    clearFileList () {
      this.fileList = []
    },
    // 压缩图片
    compressImage (file, success) {
    // 图片小于1M不压缩
      if (file.size < Math.pow(1024, 2)) {
        success(file)
        return
      }

      const name = file.name // 文件名
      const reader = new FileReader()
      let Orientation = null

      reader.readAsDataURL(file)
      // debugger
      EXIF.getData(file, function () {
        Orientation = EXIF.getTag(this, 'Orientation')
      })

      reader.onload = e => {
        const src = e.target.result

        const img = new Image()
        img.src = src
        // eslint-disable-next-line no-unused-vars
        img.onload = e => {
          const w = img.width
          const h = img.height
          let imgWidth = w
          let imgHeight = h

          // 限制图片尺寸
          if (imgWidth > imgHeight && imgWidth > 750) {
            imgWidth = 750
            imgHeight = Math.ceil(750 * h / w)
          } else if (imgWidth < imgHeight && imgHeight > 1334) {
            imgWidth = Math.ceil(1334 * w / h)
            imgHeight = 1334
          }

          const quality = this.compressQuality
          // 生成canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = imgWidth
          canvas.height = imgHeight

          // 铺底色 PNG转JPEG时透明区域会变黑色
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, imgWidth, imgHeight)
          // 解决ios拍照旋转问题
          if (Orientation && Orientation !== 1) {
            switch (Orientation) {
              case 6: // 旋转90度
                canvas.width = imgHeight
                canvas.height = imgWidth
                ctx.rotate(Math.PI / 2)
                // (0,-imgHeight) 从旋转原理图那里获得的起始点
                ctx.drawImage(img, 0, -imgHeight, imgWidth, imgHeight)
                break
              case 3: // 旋转180度
                ctx.rotate(Math.PI)
                ctx.drawImage(img, -imgWidth, -imgHeight, imgWidth, imgHeight)
                break
              case 8: // 旋转-90度
                canvas.width = imgHeight
                canvas.height = imgWidth
                ctx.rotate(3 * Math.PI / 2)
                ctx.drawImage(img, -imgWidth, 0, imgWidth, imgHeight)
                break
            }
          } else {
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
          }
          // quality值越小，所绘制出的图像越模糊
          // toDataURL参数为PNG时不支持传图片质量，所以需要写死image/jpeg或image/webp，具体可以参考toDataURL的api
          const base64 = canvas.toDataURL('image/jpeg', quality) // 图片格式jpeg或webp可以选0-1质量区间

          // 去掉url的头，并转换为byte
          const bytes = window.atob(base64.split(',')[1])
          // 处理异常,将ascii码小于0的转换为大于0
          const ab = new ArrayBuffer(bytes.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i)
          }
          file = new Blob([ab], { type: 'image/jpeg' })
          file.name = name

          success(file)
        }
        img.onerror = e => {
          this.$toast('压缩失败')
          console.log(e)
        }
      }
      reader.onerror = e => {
        this.$toast('压缩失败')
        console.log(e)
      }
    },
    // 关闭全屏的图片预览
    closeImagePreview () {
      this.$refs.uploader.closeImagePreview()
    },
    // 主动调起文件选择，由于浏览器安全限制，只有在用户触发操作的上下文中调用才有效
    chooseFile  () {
      this.$refs.uploader.chooseFile()
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-upload-wrapper{
    ::v-deep .van-uploader__upload{
      border: 1px dashed #C8D1D6;
      .van-uploader__upload-icon{
        color: #A8B8C0;
        font-weight: bold;
      }
    }
    ::v-deep .van-uploader__preview-delete{
      transform: translate(50%, -50%);
      border-radius: 50%;
      background: #FF5167;
      .van-icon {
        transform: scale(.5) translate(-10%, 10%);
      }
    }
    ::v-deep .van-image, ::v-deep .van-uploader__upload{
      border-radius: 2px;
    }
  }
</style>
