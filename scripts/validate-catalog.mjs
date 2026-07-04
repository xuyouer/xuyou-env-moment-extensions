#!/usr/bin/env node
// catalog.json 校验脚本
// 作用：检查 catalog.json 结构、每个扩展条目的必填字段、唯一性以及下载链接合法性
// 仅依赖 Node.js 内置模块（fs / path / url），无需安装任何第三方包
// 用法：node scripts/validate-catalog.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// 解析当前脚本所在目录，定位仓库根目录下的 catalog.json
const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = dirname(__dirname)
const catalogPath = join(repoRoot, 'catalog.json')

// 主题允许的色系
const ALLOWED_FAMILIES = ['natural', 'warm', 'cool', 'neutral']
// 主题允许的模式
const ALLOWED_MODES = ['light', 'dark']
// origin 字段允许的取值（缺失时默认 'community'，不报错）
const ALLOWED_ORIGINS = ['official', 'community']

// 收集所有校验错误，统一输出
const errors = []

function fail(message) {
  errors.push(message)
}

// 下载链接必须以 http:// 或 https:// 开头
function isHttpUrl(value) {
  return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
}

// 字段为空判定：未定义 / null / 空字符串 均视为缺失
function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

// 校验 origin 字段：缺失视为 'community' 不报错；存在时必须是合法枚举
function validateOrigin(entry, where) {
  if (entry.origin === undefined || entry.origin === null) return // 缺失默认 'community'，不报错
  if (!ALLOWED_ORIGINS.includes(entry.origin)) {
    fail(`${where} origin 非法：${entry.origin}（允许：${ALLOWED_ORIGINS.join('/')}）`)
  }
}

// 读取并解析 catalog.json
let catalog
try {
  const raw = readFileSync(catalogPath, 'utf-8')
  catalog = JSON.parse(raw)
} catch (err) {
  console.error('✖ catalog.json 解析失败：' + err.message)
  process.exit(1)
}

// 校验顶层结构：plugins / themes / locales 必须都是数组
if (!Array.isArray(catalog.plugins)) {
  fail('catalog.plugins 必须是数组')
}
if (!Array.isArray(catalog.themes)) {
  fail('catalog.themes 必须是数组')
}
if (!Array.isArray(catalog.locales)) {
  fail('catalog.locales 必须是数组')
}

// 校验插件条目：必填字段 + id 唯一 + downloadUrl 合法
function validatePlugins(plugins) {
  const seenIds = new Set()
  const required = ['id', 'name', 'description', 'version', 'author', 'category', 'stars', 'downloadUrl']
  plugins.forEach((p, i) => {
    const where = `plugins[${i}]`
    required.forEach((field) => {
      if (isEmpty(p[field])) fail(`${where} 缺少必填字段：${field}`)
    })
    if (p.id) {
      if (seenIds.has(p.id)) fail(`${where} id 重复：${p.id}`)
      seenIds.add(p.id)
    }
    if (p.downloadUrl && !isHttpUrl(p.downloadUrl)) {
      fail(`${where} downloadUrl 不是合法的 http(s) 链接：${p.downloadUrl}`)
    }
    validateOrigin(p, where)
  })
}

// 校验主题条目：必填字段 + id 唯一 + family/mode 取值合法 + downloadUrl 合法
function validateThemes(themes) {
  const seenIds = new Set()
  const required = ['id', 'name', 'description', 'version', 'author', 'family', 'mode', 'downloadUrl']
  themes.forEach((t, i) => {
    const where = `themes[${i}]`
    required.forEach((field) => {
      if (isEmpty(t[field])) fail(`${where} 缺少必填字段：${field}`)
    })
    if (t.id) {
      if (seenIds.has(t.id)) fail(`${where} id 重复：${t.id}`)
      seenIds.add(t.id)
    }
    if (t.family && !ALLOWED_FAMILIES.includes(t.family)) {
      fail(`${where} family 非法：${t.family}（允许：${ALLOWED_FAMILIES.join('/')}）`)
    }
    if (t.mode && !ALLOWED_MODES.includes(t.mode)) {
      fail(`${where} mode 非法：${t.mode}（允许：${ALLOWED_MODES.join('/')}）`)
    }
    if (t.downloadUrl && !isHttpUrl(t.downloadUrl)) {
      fail(`${where} downloadUrl 不是合法的 http(s) 链接：${t.downloadUrl}`)
    }
    validateOrigin(t, where)
  })
}

// 校验语言包条目：必填字段 + code 唯一 + downloadUrl 合法
function validateLocales(locales) {
  const seenCodes = new Set()
  const required = ['code', 'nativeName', 'flag', 'version', 'author', 'downloadUrl']
  locales.forEach((l, i) => {
    const where = `locales[${i}]`
    required.forEach((field) => {
      if (isEmpty(l[field])) fail(`${where} 缺少必填字段：${field}`)
    })
    if (l.code) {
      if (seenCodes.has(l.code)) fail(`${where} code 重复：${l.code}`)
      seenCodes.add(l.code)
    }
    if (l.downloadUrl && !isHttpUrl(l.downloadUrl)) {
      fail(`${where} downloadUrl 不是合法的 http(s) 链接：${l.downloadUrl}`)
    }
    validateOrigin(l, where)
  })
}

if (Array.isArray(catalog.plugins)) validatePlugins(catalog.plugins)
if (Array.isArray(catalog.themes)) validateThemes(catalog.themes)
if (Array.isArray(catalog.locales)) validateLocales(catalog.locales)

// 输出结果：失败列出全部问题并退出码 1，通过则打印绿色对勾与统计
if (errors.length > 0) {
  console.error('✖ catalog 校验失败，发现 ' + errors.length + ' 个问题：')
  errors.forEach((e) => console.error('  • ' + e))
  process.exit(1)
} else {
  console.log('✓ catalog 校验通过')
  console.log(`  插件：${catalog.plugins.length} 个`)
  console.log(`  主题：${catalog.themes.length} 个`)
  console.log(`  语言：${catalog.locales.length} 个`)
  process.exit(0)
}
