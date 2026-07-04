# 贡献指南

## 简介

本仓库是「许柚环境时刻」桌面应用的官方云端扩展合集，主应用通过拉取 `catalog.json` 在「插件中心 / 主题中心 / 语言中心」的「云端」标签页展示可用扩展。欢迎社区贡献插件、主题与语言包。

## 前置准备

- Node.js >= 18
- pnpm >= 8
- Git
- GitHub 账号

## 贡献流程

1. **Fork** 本仓库到个人账号，并克隆到本地。
2. **编写扩展**：在 `plugins/`、`themes/`、`locales/` 对应目录下新建子目录，包含合规的 `manifest.json`（插件还需 `main.js`）。
3. **本地测试**：将扩展放入主应用的本地扩展目录进行加载测试，确认功能与样式符合预期。
4. **登记到 catalog**：在 `catalog.json` 的对应数组中追加条目，填写必填字段与 `downloadUrl`。
5. **运行校验**：执行 `node scripts/validate-catalog.mjs`，确认输出 `✓ catalog 校验通过`。
6. **提交 PR**：向本仓库 `main` 分支发起 Pull Request，等待审核。

## manifest 规范要点

- 各类型 manifest 的完整字段定义见主应用扩展开发文档：
  - 插件：`https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/plugin-development.md`
  - 主题：`https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/theme-development.md`
  - 语言包：`https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/locale-development.md`
  - 通用模板：`https://github.com/xuyouer/xuyou-env-moment/blob/main/docs/extension-development/xuyou-extension-template.md`
- `id` 使用反向域名风格（如 `ltd.xiaomizha.hello-plugin`），全仓唯一。
- `version` 遵循 [语义化版本](https://semver.org/lang/zh-CN/)。
- `downloadUrl` 须指向**已发布 tag** 对应的归档地址，避免指向可变分支。
- `origin` 字段：`'official'` 或 `'community'`，默认 `'community'`。贡献者提交的扩展请勿标记为 `'official'`，由维护者在审核时确定。

## 审核标准

- **manifest 合规**：字段齐全、类型正确、与 schema 一致。
- **主题配色覆盖**：`colors` 必须覆盖全部约定键（bg / surface / text / accent / warning / success / error 等），无明显对比度问题。
- **插件沙箱安全**：仅在注入的 `ctx`、`pluginRegistry`、`Vue` 作用域内操作，不访问未授权 API，不内联远程脚本，不收集用户隐私。
- **语言包结构**：`messages` 结构需与默认语言包一致，键名完整，翻译质量过关。
- **downloadUrl 锁定 tag**：链接指向固定版本归档，便于复现与回滚。
- **来源标记（origin）**：贡献者扩展默认 `origin: 'community'`，请勿在 PR 中自行标记为 `'official'`；维护者将在审核时根据是否纳入官方维护范围决定是否调整为 `'official'`，并在合并前同步更新 `catalog.json`。

## 版本管理

- 所有扩展遵循语义化版本（`MAJOR.MINOR.PATCH`）。
- 升级流程：修改扩展内容 → 递增 manifest 中的 `version` → 发布新 tag → 更新 `catalog.json` 中对应条目的 `version` 与 `downloadUrl` → 运行校验脚本 → 提交 PR。

## 提交 PR 格式

Pull Request 标题统一采用：

```text
add: <type> <id> v<version>
```

- `<type>` 取值：`plugin` / `theme` / `locale`
- `<id>` 为扩展 id（插件）或 code/name（主题、语言包）
- `<version>` 为本次提交的版本号

示例：

```text
add: plugin ltd.xiaomizha.hello-plugin v1.0.0
add: theme meadow-light v1.0.0
add: locale en-US v1.0.0
```

更新已有扩展时使用 `update:` 前缀，例如 `update: theme meadow-light v1.1.0`。
