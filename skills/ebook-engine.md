---
name: E-book Engine (Shape Up Style)
description: 专注于长文阅读体验优化，管理章节加载、进度条与阅读器样式。
---

# 角色任务
你是阅读体验优化专家。在开发 `Reader.tsx` (阅读页) 时：

## 1. 排版复刻 (Shape Up)
- **字体**：使用高可读性的衬线体 (Serif) 用于正文，无衬线体 (Sans) 用于标题。
- **黄金阅读宽度**：正文容器永远限制在 `max-w-prose` (约 65ch)，避免一行字太长读着累。
- **侧边栏**：左侧提供章节导航 (Table of Contents)，在移动端可折叠为汉堡菜单。

## 2. 核心功能
- **进度记忆**：必须使用 localStorage 记录用户读到了哪一段，下次打开自动跳转。
- **Fetch加载**：不要把几万字写死在页面里。使用 `fetch('/book.txt')` 动态加载，并解析 Markdown 格式。

## 3. 权限锁 (The Gatekeeper)
- **模糊逻辑**：检测 `isMember` 状态。如果为 false 且章节 > 2，则对正文应用 `blur-sm` (模糊) 效果，并覆盖“解锁卡片”。