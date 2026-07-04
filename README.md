# xuyou-env-moment-extensions

官方扩展合集仓库，作为「许柚环境时刻」桌面应用的云端 catalog 来源。主应用会从本仓库拉取 `catalog.json`，在「插件中心 / 主题中心 / 语言中心」的「云端」标签页中展示可用扩展。

## 仓库结构

```text
xuyou-env-moment-extensions/
├── catalog.json                 # 云端 catalog 入口，主应用拉取此文件
├── plugins/                     # 插件目录
│   ├── hello-plugin/            # 最小示例插件
│   │   ├── manifest.json
│   │   └── main.js
│   ├── quick-notes/             # 快捷笔记面板插件
│   │   ├── manifest.json
│   │   └── main.js
│   └── window-manager/          # 窗口快捷操作插件
│       ├── manifest.json
│       └── main.js
├── themes/                      # 主题目录
│   ├── meadow-light/            # 自然系浅色主题
│   │   └── manifest.json
│   ├── sunset-orchard/          # 暖色亮色主题
│   │   └── manifest.json
│   └── midnight-iris/           # 冷色暗色主题
│       └── manifest.json
├── locales/                     # 语言包目录
│   ├── zh-TW/                   # 繁體中文（台湾）
│   │   └── manifest.json
│   ├── pt-BR/                   # Português (Brasil)
│   │   └── manifest.json
│   └── vi-VN/                   # Tiếng Việt
│       └── manifest.json
├── scripts/
│   └── validate-catalog.mjs     # catalog 校验脚本（零依赖）
├── CONTRIBUTING.md              # 贡献指南
├── LICENSE                      # MIT 许可证
└── .gitignore
```

## 如何贡献

欢迎提交插件、主题、语言包。简要步骤如下，详见 [CONTRIBUTING.md](./CONTRIBUTING.md)：

1. Fork 本仓库
2. 在对应目录下编写扩展，并完善 `manifest.json`
3. 本地测试通过后，将条目加入 `catalog.json`
4. 运行校验脚本：`node scripts/validate-catalog.mjs`
5. 提交 Pull Request，标题格式：`add: <type> <id> v<version>`

## 官方扩展

本仓库内置以下 9 条官方扩展，均由 XuYou 团队维护并在 `catalog.json` 中标记为 `origin: 'official'`，随主应用云端页面默认展示：

| 类型 | ID / Code | 名称 | 版本 | 说明 |
| --- | --- | --- | --- | --- |
| 主题 | `meadow-light` | 草甸浅色 | 1.0.0 | 自然系浅色主题 |
| 主题 | `sunset-orchard` | 日落果园 | 1.0.0 | 暖色亮色主题 |
| 主题 | `midnight-iris` | 午夜鸢尾 | 1.0.0 | 冷色暗色主题 |
| 语言包 | `zh-TW` | 繁體中文 | 1.0.0 | 繁体中文（台湾） |
| 语言包 | `pt-BR` | Português (Brasil) | 1.0.0 | 巴西葡萄牙语 |
| 语言包 | `vi-VN` | Tiếng Việt | 1.0.0 | 越南语 |
| 插件 | `ltd.xiaomizha.hello-plugin` | Hello 插件 | 1.0.0 | 最小示例插件 |
| 插件 | `ltd.xiaomizha.quick-notes` | 快捷笔记 | 1.0.0 | 侧边快速笔记面板 |
| 插件 | `ltd.xiaomizha.window-manager` | 窗口管理器 | 1.0.0 | 窗口快捷操作工具 |

### origin 字段

`catalog.json` 中每个条目都有一个 `origin` 字段，用于标识扩展来源：

- `'official'`：由 XuYou 团队官方维护的扩展。主应用云端页面（插件中心 / 主题中心 / 语言中心）默认展示「官方」来源筛选，用户可切换至「社区」或「全部」。
- `'community'`：由社区贡献的扩展。贡献者提交的扩展默认归为此类。
- 字段可省略，加载器解析 `catalog.json` 时会为缺失 `origin` 的条目填充默认值 `'community'`，校验脚本对缺失不报错。
- **贡献者注意**：提交 PR 时请勿将自己的扩展标记为 `'official'`，该字段由维护者在审核时根据是否纳入官方维护范围确定。

## 校验脚本

提交前请运行校验脚本，确保 `catalog.json` 结构与字段合法（仅依赖 Node.js 内置模块，无需安装依赖）：

```bash
node scripts/validate-catalog.mjs
```

通过时会输出绿色对勾与统计信息；失败时会以红色叉号列出全部问题，并以退出码 `1` 退出。

## 相关文档

扩展开发规范请参考主应用仓库内的开发文档：

- [插件开发指南](https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/plugin-development.md)
- [主题开发指南](https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/theme-development.md)
- [语言包开发指南](https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/locale-development.md)
- [扩展模板](https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/xuyou-extension-template.md)

## 许可证

[MIT](./LICENSE)

## GitHub 地址

https://github.com/xuyouer/xuyou-env-moment-extensions
