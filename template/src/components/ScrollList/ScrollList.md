# ScrollList 下拉刷新，上拉加载更多列表

### 介绍

瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项，与 PullRefresh 组件结合使用，实现下拉刷新的效果

### 附官方文档
List[官方文档](https://youzan.github.io/vant/#/zh-CN/list).
PullRefresh[官方文档](https://youzan.github.io/vant/#/zh-CN/pull-refresh).

### 引入

```js
components: {
  'scroll-list': () => import('@/components/ScrollList/ScrollList')
}
```

## 代码演示

### 基本使用

传入 getData 方法组件内部会自动调用

```html
<scroll-list ref="list" :data="list" :total="total" :getData="getList">
  <div class="item" style="padding: 20px;border:2px solid red;" v-for="item in list" :key="item.id">{{item.name}}</div>
</scroll-list>
```

```js
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      total: 0
  },
  methods: {
    // 获取列表
    // 接收是否为刷新的回调字段
    async getList (isRefresh) {
      if (isRefresh) {
        this.page = 1
      }
      const res = await getNewsList({
        start: this.page,
        limit: this.pageSize
      })

      if (res.success) {
        this.total = res.totalCount
        this.page++
        this.list = isRefresh ? res.data : this.list.concat(res.data)
      } else {
        // 获取失败时抛出异常 可让组件内部捕获 显示错误提示
        throw new Error(res.message)
      }
    }
  }
};
```

### 自定义提示

通过插槽可以自定义下拉刷新过程中的提示内容

```html
<scroll-list ref="list" :data="list" :total="total" :getData="getNewsList">
    <!-- 下拉过程中顶部内容 -->
  <template #pulling="{distance}">
    <div class="preview-cover van-ellipsis">{{ distance.distance }}pulling</div>
  </template>
    <!-- 释放过程中顶部内容 -->
  <template #loosing="{distance}">
    <div class="preview-cover van-ellipsis">{{ distance.distance }}loosing</div>
  </template>
    <!-- 加载过程中顶部内容 -->
  <template #refresh-loading>
    <div class="preview-cover van-ellipsis">loading</div>
  </template>
    <!-- 非下拉状态时顶部内容 -->
  <template #normal>
    <div class="preview-cover van-ellipsis">normal</div>
  </template>
    <!-- 刷新成功提示内容 -->
  <template #success>
    <div class="preview-cover van-ellipsis">success</div>
  </template>
  <div class="item" style="padding: 20px;border:2px solid red;" v-for="item in list" :key="item.id">{{item.name}}</div>
  <!-- 自定义底部加载中提示 -->
  <template #loading>
    <div class="preview-cover van-ellipsis">loading</div>
  </template>
  <!-- 自定义加载完成后的提示文案 -->
  <template #finished>
    <div class="preview-cover van-ellipsis">finished</div>
  </template>
  <!-- 自定义加载失败后的提示文案 -->
  <template #error>
    <div class="preview-cover van-ellipsis">error</div>
  </template>
</scroll-list>
```

```js
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      total: 0
  },
  methods: {
    // 获取列表
    // 接收是否为刷新的回调字段
    async getList (isRefresh) {
      if (isRefresh) {
        this.page = 1
      }
      const res = await getNewsList({
        start: this.page,
        limit: this.pageSize
      })

      if (res.success) {
        this.total = res.totalCount
        this.page++
        this.list = isRefresh ? res.data : this.list.concat(res.data)
      } else {
        // 获取失败时抛出异常 可让组件内部捕获 显示错误提示
        throw new Error(res.message)
      }
    }
  }
};
```

### 首次不自动调用接口

List 初始化后会触发一次 load 事件，用于加载第一屏的数据，这个特性可以通过immediate-check属性关闭。

```html
<scroll-list :immediateCheck="false" ref="list" :data="list" :total="total" :getData="getNewsList">
  <div class="item" style="padding: 20px;border:2px solid red;" v-for="item in list" :key="item.id">{{item.name}}</div>
</scroll-list>
```

```js
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      total: 0
  },
  async mounted () {
    await this.getNewsList()
    // 如果获取的数据无法填满整屏需要检查当前滚动位置，判断是否是否需要触发下一页接口
    this.$nextTick(() => {
      setTimeout(() => {
        // 如果数据能够铺满整个屏幕则不用执行下面代码
        // 如果不检查且获取的数据无法填充整个屏幕则无法滚动到下一页
        // 因此建议使用immediateCheck时,要么执行下面的方法,要么获取的数据页数大一点铺满整个屏幕
        this.$refs.list.check()
      })
    })
  },
  methods: {
    // 获取列表
    // 接收是否为刷新的回调字段
    async getList (isRefresh) {
      if (isRefresh) {
        this.page = 1
      }
      const res = await getNewsList({
        start: this.page,
        limit: this.pageSize
      })

      if (res.success) {
        this.total = res.totalCount
        this.page++
        this.list = isRefresh ? res.data : this.list.concat(res.data)
      } else {
        // 获取失败时抛出异常 可让组件内部捕获 显示错误提示
        throw new Error(res.message)
      }
    }
  }
};
```


### 禁用下拉刷新

通过 `disabled` 属性禁用下拉刷新

```html
<scroll-list disabled></scroll-list>
```

## API

### Props

    getData: {
      type: Function,
      default: () => {}
    },
    total: {
      type: Number,
      default: -1
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getData | 获取数据函数，参数 isRefresh 是否刷新触发 | _Function_ | `() => {}` |
| total | 列表数据总长度 | _number_ | `-1` |
| data | 列表数据数组 | _Array_ | `[]` |
| offset | 滚动条与底部距离小于 offset 时触发`load`事件 | _number \| string_ | `300` |
| loadingText | 加载过程中的提示文案 | _string_ | `加载中...` |
| finishedText | 加载完成后的提示文案 | _string_ | - |
| errorText | 加载失败后的提示文案 | _string_ | - |
| noDataText | 没有数据提示文案 | _string_ | `暂无数据` |
| immediateCheck | 是否在初始化时立即执行滚动位置检查 | _boolean_ | `true` |
| pulling-text | 下拉过程提示文案 | _string_ | `下拉即可刷新...` |
| loosing-text | 释放过程提示文案 | _string_ | `释放即可刷新...` |
| refreshLoadingText | 加载过程提示文案 | _string_ | `加载中...` |
| success-text | 刷新成功提示文案 | _string_ | - |
| success-duration | 刷新成功提示展示时长(ms) | _number \| string_ | `500` |
| animation-duration | 动画时长 | _number \| string_ | `300` |
| head-height `v2.4.2` | 顶部内容高度 | _number \| string_ | `50` |
| disabled | 是否禁用下拉刷新 | _boolean_ | `false` |

### Events

| 事件名  | 说明           | 回调参数 |
| ------- | -------------- | -------- |
| refresh | 下拉刷新时触发 | -        |

### 方法

通过 ref 可以获取到 List 实例并调用实例方法，详见[组件实例方法](#/zh-CN/advanced-usage#zu-jian-shi-li-fang-fa)。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| check | 检查当前的滚动位置，若已滚动至底部，则会触发 load 事件 | - | - |

### Slots

| 名称    | 说明                 | 参数                       |
| ------- | -------------------- | -------------------------- |
| default  | 列表内容                   |
| loading  | 自定义底部加载中提示       |
| finished | 自定义加载完成后的提示文案 |
| error    | 自定义加载失败后的提示文案 |
| normal  | 非下拉状态时顶部内容 | -                          |
| pulling | 下拉过程中顶部内容   | { distance: 当前下拉距离 } |
| loosing | 释放过程中顶部内容   | { distance: 当前下拉距离 } |
| refresh-loading | 加载过程中顶部内容   | { distance: 当前下拉距离 } |
| success | 刷新成功提示内容     | -                          |

## 常见问题
### List 的运行机制是什么？

List 会监听浏览器的滚动事件并计算列表的位置，当列表底部与可视区域的距离小于`offset`时，List 会触发一次 load 事件。

### 为什么 List 初始化后会立即触发 load 事件？

List 初始化后会触发一次 load 事件，用于加载第一屏的数据，这个特性可以通过`immediate-check`属性关闭。

### 为什么会连续触发 load 事件？

如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。因此你需要调整每次获取的数据条数，理想情况下每次请求获取的数据条数应能够填满一屏高度。

### loading 和 finished 分别是什么含义？

`List`有以下三种状态，理解这些状态有助于你正确地使用`List`组件：

- 非加载中，`loading`为`false`，此时会根据列表滚动位置判断是否触发`load`事件（列表内容不足一屏幕时，会直接触发）
- 加载中，`loading`为`true`，表示正在发送异步请求，此时不会触发`load`事件
- 加载完成，`finished`为`true`，此时不会触发`load`事件

在每次请求完毕后，需要手动将`loading`设置为`false`，表示加载结束

### 使用 float 布局后一直触发加载？

若 List 的内容使用了 float 布局，可以在容器上添加`van-clearfix`类名来清除浮动，使得 List 能正确判断元素位置

```html
<van-list>
  <div class="van-clearfix">
    <div class="float-item" />
    <div class="float-item" />
    <div class="float-item" />
  </div>
</van-list>
```

### 在 html、body 上设置 overflow 后一直触发加载？

如果在 html 和 body 标签上设置了`overflow-x: hidden`样式，会导致 List 一直触发加载。

```css
html,
body {
  overflow-x: hidden;
}
```

这个问题的原因是当元素设置了`overflow-x: hidden`样式时，该元素的`overflow-y`会被浏览器设置为`auto`，而不是默认值`visible`，导致 List 无法正确地判断滚动容器。解决方法是去除该样式，或者在 html 和 body 标签上添加`height: 100%`样式。

### PullReresh 的内容未填满屏幕时，只有一部分区域可以下拉？

默认情况下，下拉区域的高度是和内容高度保持一致的，如果需要让下拉区域始终为全屏，可以给 PullRefresh 设置一个与屏幕大小相等的最小高度：

```html
<van-pull-refresh style="min-height: 100vh;" />
```
