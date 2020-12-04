<template>
  <div class="error-page-wrapper">
    <div class="error-icon"></div>
    <slot>
      <p class="error-text">网络好像出了点小问题</p>
    </slot>
    <div class="refresh-btn" v-if="errorFn" @click="errorFn">点击刷新</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    errorFn: {
      type: Function
    }
  }
}
</script>

<style lang="scss" scoped>
  .error-page-wrapper{
    font-size: 14px;
    color: #999;
    @include flexCenter();
    background: #fff;
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    flex-direction: column;
    .error-icon{
      @include bgImage('../assets/error', 109px, 105px);
      margin-bottom: 18px;
    }
    .refresh-btn{
      color: #2777FC;
      margin-top: 12px;
    }
  }
</style>
