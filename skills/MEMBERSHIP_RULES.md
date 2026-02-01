# 核心会员规则 (Membership Rules)

本文档描述了 **RichBoss Reader** 当前实际运行的访问控制与会员逻辑。

## 1. 核心逻辑

### 1.1 试读限制 (Trial Access)
- **规则**：非会员仅可阅读前 **2** 个章节。
- **配置**：`src/pages/Reader.tsx` -> `bookConfig.previewChapters = 2`。
- **行为**：
    - 章节索引 `0` (第1章) 和 `1` (第2章)：**开放阅读**。
    - 章节索引 `2` 及以后：**强制锁定**。

### 1.2 锁章机制 (Locking Mechanism)
- **物理阻断**：当用户访问锁定章节时，系统**不渲染**任何正文 DOM 节点，防止通过开发者工具查看源代码。
- **UI 展示**：
    - 阅读器正文区域被替换为 `<LockScreen />` 组件。
    - 显示“会员专属”提示及升级引导按钮。
    - 目录 (TOC) 中，锁定章节显示 🔒 图标。

### 1.3 会员判断 (Membership Check)
- **数据源**：Firebase Firestore (`users/{uid}`)。
- **字段**：`isMember` (boolean)。
- **逻辑**：
    1. 用户登录后，实时从 Firestore 拉取用户文档。
    2. 若文档存在且 `isMember === true`，则视为会员。
    3. 否则（文档不存在、字段缺失、字段为 false），视为非会员。
- **默认安全**：在数据加载完成前，默认为“非会员”状态，确保安全。

## 2. 代码位置

| 功能模块 | 文件路径 | 关键函数/变量 |
| :--- | :--- | :--- |
| **阅读器主逻辑** | `src/pages/Reader.tsx` | `Reader` Component |
| **试读配置** | `src/pages/Reader.tsx` | `const bookConfig` |
| **权限检查** | `src/pages/Reader.tsx` | `canAccessChapter(index)` |
| **会员状态获取** | `src/pages/Reader.tsx` | `useEffect` -> `getDoc(db, "users", uid)` |
| **管理员后台** | `src/pages/Admin.tsx` | `toggleMembership` |

## 3. 功能现状说明

- **章节拆分**：系统根据正则表达式 `/(?=第[0-9]+章|Chapter)/` 自动拆分书籍。如果`book.txt`格式不规范导致无法拆分，则会被视为“单章”，导致全书免费（需注意）。
- **进度记忆**：仅在有访问权限的章节（试读或会员）保存阅读进度。
- **防复制**：已禁用右键、文本选中及 Ctrl+C。

## 4. 差异说明 (vs 原需求)

*当前版本基于 "V2 验收版" 实现，与部分早期概念存在差异：*
- **限制方式**：采用**按章限制** (Trial Chapters)，而非按字数限制 (Word Count)。
- **搜索功能**：尚未实现。
