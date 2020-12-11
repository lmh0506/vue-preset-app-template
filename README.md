

## 如何通过项目模板创建自己的应用
### 使用远程 Preset

``` bash
vue create --preset lmh0506/vue-preset-app-template my-project
```

### 加载文件系统中的 Preset

当开发一个远程 preset 的时候，你必须不厌其烦的向远程 repo 发出 push 进行反复测试。为了简化这个流程，你也可以直接在本地测试 preset。如果 `--preset` 选项的值是一个相对或绝对文件路径，或是以 `.json` 结尾，则 Vue CLI 会加载本地的 preset：
[下载地址](https://github.com/lmh0506/vue-preset-app-template)
``` bash
# ./my-preset 应当是一个包含 preset.json 的文件夹
vue create --preset ./vue-app-vw-template my-project

```
### Preset和插件的详细用法
[Vue Cli 官网有详细教程](https://cli.vuejs.org/zh/guide/plugins-and-presets.html)

### 使用vw实现移动端适配
[如何在Vue项目中使用vw实现移动端适配](https://www.jianshu.com/p/1f1b23f8348f)
### vant官网
[vant官网](https://youzan.github.io/vant/#/zh-CN/)