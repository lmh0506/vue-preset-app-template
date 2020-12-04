<template>
  <div id="app">
    <transition
      :enter-active-class="enterActiveClass"
      :leave-active-class="leaveActiveClass">
      <template v-if="isCache">
        <keep-alive >
          <router-view class="app-view"/>
        </keep-alive>
      </template>
      <template v-else>
        <router-view class="app-view"/>
      </template>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slideType: ''
    }
  },
  computed: {
    enterActiveClass () {
      if (this.slideType === 'to') {
        return 'animated-ease-out slideInRightEnter'
      } else if (this.slideType === 'from') {
        return 'animated-fast slideInLeftLeave'
      } else {
        return ''
      }
    },
    leaveActiveClass () {
      if (this.slideType === 'to') {
        return 'animated animated-delay slideOutLeftLeave'
      } else if (this.slideType === 'from') {
        return 'animated slideOutRightEnter'
      } else {
        return ''
      }
    },
    isCache () {
      return this.$route.meta.cache
    }
  },
  // watch $route 决定使用哪种过渡
  watch: {
    '$route' (to, from) {
      // 通过路由的index层级来决定动画效果
      const tIndex = to.meta.index
      const fIndex = from.meta.index
      if (tIndex && fIndex) {
        this.slideType = tIndex < fIndex ? 'from' : tIndex === fIndex ? '' : 'to'
      } else {
        this.slideType = ''
      }
    }
  }
}
</script>

<style lang="scss" scope>
  #app{
    height: 100%;
  }
  // 对所有页面使用绝对定位布局  使得动画过渡更加舒适
  .app-view{
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
    background: #F5F5F5;
  }
  .animated-delay{
    animation-delay: .1s;
  }
  .animated-fast{
    animation-duration: .2s;
    animation-fill-mode: both;
  }
  .animated-ease-out{
    animation-duration: .3s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
  }
</style>
