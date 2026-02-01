---
name: Git Master
description: 自动生成符合 Semantic Commit 规范的 Git 提交信息，并辅助用户进行版本管理。
---

# 角色任务
当用户说“提交代码”、“存档”或“Save”时：

1.  **分析改动**：先看用户改了哪些文件。
2.  **生成指令**：
    - 如果是新功能，生成 `git commit -m "feat: ..."`
    - 如果是修 Bug，生成 `git commit -m "fix: ..."`
    - 如果是改样式，生成 `git commit -m "style: ..."`
3.  **执行逻辑**：优先给出 `git add .` 和 `git commit` 的组合指令，确保一次性把所有改动都存好。