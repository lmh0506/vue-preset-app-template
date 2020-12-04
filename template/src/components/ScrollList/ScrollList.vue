<template>
  <van-pull-refresh
    class="scroll-list-wrapper"
    :class="{'no-data': noData}"
    v-bind="$props"
    v-on="$listeners"
    v-model="isRefresh"
    :loading-text="refreshLoadingText"
    @refresh="onRefresh">
    <!-- 非下拉状态时顶部内容 -->
    <template #normal>
      <slot name="normal"></slot>
    </template>
    <!-- 下拉过程中顶部内容 -->
    <template #pulling="distance">
      <slot :distance="distance" name="pulling"></slot>
    </template>
    <!-- 释放过程中顶部内容 -->
    <template #loosing="distance">
      <slot :distance="distance" name="loosing"></slot>
    </template>
    <!-- 加载过程中顶部内容 -->
    <template #loading="distance">
      <slot :distance="distance" name="refresh-loading"></slot>
    </template>
    <!-- 刷新成功提示内容 -->
    <template #success>
      <slot name="success"></slot>
    </template>

    <slot name="no-data" v-if="noData">
      <div class="no-data-wrapper">
        <div class="no-data"></div>
        <p>{{noDataText}}</p>
      </div>
    </slot>
    <van-list
      ref="list"
      v-else
      v-model="loading"
      :immediate-check="immediateCheck"
      :finished="finished"
      :error.sync="error"
      :error-text="errorText"
      :finished-text="finishedText"
      :loading-text="loadingText"
      :offset="offset"
      @load="getPageData">
      <!-- 列表内容 -->
      <slot></slot>
      <!-- 自定义底部加载中提示 -->
      <template #loading>
        <slot name="loading"></slot>
      </template>
      <!-- 自定义加载完成后的提示文案 -->
      <template #finished>
        <slot name="finished"></slot>
      </template>
      <!-- 自定义加载失败后的提示文案 -->
      <template #error>
        <slot name="error"></slot>
      </template>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { PullRefresh } from 'vant'
export default {
  name: 'ScrollList',
  props: {
    ...PullRefresh.props,
    // 获取数据函数，参数 isRefresh 是否刷新触发
    getData: {
      type: Function,
      default: () => {}
    },
    // 列表数据总长度
    total: {
      type: Number,
      default: -1
    },
    // 列表数据数组
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否在初始化时立即执行滚动位置检查  如果触碰到到底部则相当于自动执行getData方法
    immediateCheck: {
      type: Boolean,
      default: true
    },
    // 加载失败后的提示文案
    errorText: {
      type: String,
      default: '请求失败，点击重新加载'
    },
    // 加载完成后的提示文案
    finishedText: {
      type: String,
      default: '没有更多了'
    },
    // 加载过程中的提示文案
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // 没有数据提示文案
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    // 滚动条与底部距离小于 offset 时触发load事件
    offset: {
      type: [String, Number],
      default: 300
    },
    // pull-refresh props
    // 加载过程提示文案
    refreshLoadingText: {
      type: String,
      default: '加载中...'
    },
    // 没有实际意义 因为引入了pull-refresh props， 去掉会报错
    value: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false, // 加载loading
      isRefresh: false, // 刷新loading
      error: false, // 请求失败
      finished: false // 是否全部加装完成
    }
  },
  computed: {
    noData () { // 是否为空数据
      return this.finished && this.data.length === 0
    }
  },
  methods: {
    async getPageData (isRefresh) {
      if (isRefresh) {
        this.isRefresh = true
      } else {
        this.loading = true
      }

      if (isRefresh || !this.finished) {
        try {
          await this.getData(isRefresh)
        } catch (e) {
          console.log(e)
          this.error = true
        }
      }
      this.finished = this.total <= this.data.length

      if (isRefresh) {
        this.isRefresh = false
        this.$nextTick(() => {
          this.check()
        })
      } else {
        this.loading = false
      }
    },
    onRefresh () {
      this.$emit('refresh')
      this.getPageData(true)
    },
    // 检查当前的滚动位置，若已滚动至底部，则会触发 load 事件
    check () {
      this.$refs.list.check()
    }
  }
}
</script>

<style lang="scss" scoped>
  .no-data-wrapper{
    box-sizing: border-box;
    padding: 112px 0;
    .no-data{
      @include bgImage('../../assets/no_data', 131px, 121px);
      margin: 0px auto 20px;
    }
    >p{
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
</style>
