import Vue from 'vue'
import { judgeDeviceType } from '@/utils/utils'

const judgeDevice = judgeDeviceType()

function listenKeybord ($input) {
  if (judgeDevice.isIOS) {
    $input.addEventListener('focus', function () {
      console.log('IOS 键盘弹起啦！')
      // activeElementScrollIntoView(this, 1000);
    }, false)

    // IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur', () => {
      console.log('IOS 键盘收起啦！')

      // 微信浏览器版本6.7.4+IOS12会出现键盘收起后，视图被顶上去了没有下来
      // eslint-disable-next-line no-useless-escape
      var wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
      if (!wechatInfo) return

      var wechatVersion = wechatInfo[1]
      var version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)

      if (+wechatVersion.replace(/\./g, '') >= 674 && +version[1] >= 12) {
        window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight))
      }
    })
  }

  // Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
  if (judgeDevice.isAndroid) {
    $input.addEventListener('focus', function () {
      activeElementScrollIntoView($input, 1000)
    }, false)

    var originHeight = document.documentElement.clientHeight || document.body.clientHeight

    window.addEventListener('resize', function () {
      var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (originHeight < resizeHeight) {
        console.log('Android 键盘收起啦！')
        $input.blur()
        // 修复小米浏览器下，输入框依旧被输入法遮挡问题
        if (judgeDevice.isMiuiBrowser) {
          document.body.style.marginBottom = '0px'
        }
      } else {
        console.log('Android 键盘弹起啦！')

        // 修复小米浏览器下，输入框依旧被输入法遮挡问题
        if (judgeDevice.isMiuiBrowser) {
          document.body.style.marginBottom = '40px'
        }
      }

      originHeight = resizeHeight
    }, false)
  }
}

function activeElementScrollIntoView (activeElement, delay) {
  var editable = activeElement.getAttribute('contenteditable')

  // 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区
  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || editable === '' || editable) {
    setTimeout(function () {
      activeElement.scrollIntoView()
    }, delay)
  }
}

Vue.directive('keyboardfocus', {
  inserted: function (el) {
    const dom = el.querySelector('input[type=text]') || el.querySelector('input[type=textarea]')
    listenKeybord(dom)
  }
})
