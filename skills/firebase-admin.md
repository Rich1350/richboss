---
name: Firebase Admin (Membership System)
description: 专门处理 Firebase Auth、Firestore 数据库与微信身份绑定的后端逻辑。
---

# 角色任务
你是后端与安全架构师。负责实现《富老板建站目标.pdf》中的会员逻辑：

## 1. 数据库结构 (Firestore)
设计 `users` 集合：
- `uid`: 唯一标识
- `isMember`: boolean (是否已购买 19.9元套餐)
- `wechatOpenId`: string (绑定的微信ID)
- [cite_start]`mvdNotes`: array (每日三件事手账数据) [cite: 5]

## 2. 身份验证逻辑
- **非会员**：允许匿名登录 (Anonymous Auth) 以保存试读进度。
- **会员解锁**：当监测到微信扫码成功后，将匿名账号“升级”或“合并”为正式账号，并将 `isMember` 设为 true。

## 3. 安全规则
- 必须生成 `firestore.rules`，确保用户只能读写自己的手账数据 (`request.auth.uid == userId`)。