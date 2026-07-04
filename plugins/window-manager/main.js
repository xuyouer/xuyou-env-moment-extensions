// 插件运行在应用提供的沙箱作用域内，下列全局对象由主应用注入：
// - ctx           应用上下文，提供 i18n、事件总线、存储等能力
// - pluginRegistry 插件注册表，插件通过它声明自身元信息与生命周期回调
// - Vue           主应用注入的 Vue 运行时，可在作用域内直接使用，无需自行打包
;(function (ctx, pluginRegistry, Vue) {
  'use strict'

  // 向插件注册表登记本插件：元信息 + 生命周期回调
  pluginRegistry.register({
    id: 'ltd.xiaomizha.window-manager',
    name: '窗口管理器',
    onEnable: function () {
      console.log('[window-manager] enabled')
    },
    onDisable: function () {
      console.log('[window-manager] disabled')
    }
  })
})(ctx, pluginRegistry, Vue)
