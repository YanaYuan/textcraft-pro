# 手动推送到GitHub指南

## 当前状态
- 本地仓库配置正确：`https://github.com/YanaYuan/textcraft-pro.git`
- 所有功能修改已完成
- 需要推送到GitHub但遇到连接问题

## 手动推送步骤

### 1. 检查GitHub认证
```bash
# 如果还没有设置个人访问令牌(PAT)
# 1. 访问 https://github.com/settings/tokens
# 2. 点击 "Generate new token (classic)"
# 3. 选择权限：repo, workflow, write:packages
# 4. 复制生成的token

# 使用token推送
git push https://YOUR_TOKEN@github.com/YanaYuan/textcraft-pro.git main
```

### 2. 或者使用SSH（推荐）
```bash
# 先设置SSH密钥（如果还没有）
# 1. 生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 2. 添加到GitHub账户
# 复制 ~/.ssh/id_rsa.pub 内容到 GitHub SSH keys 设置

# 3. 更改远程URL为SSH
git remote set-url origin git@github.com:YanaYuan/textcraft-pro.git

# 4. 推送
git push origin main
```

### 3. 验证推送成功
```bash
# 检查远程分支
git ls-remote origin

# 查看提交历史
git log --oneline -5
```

## 已修改的文件列表
- ✅ index.html - 功能按钮更新，语言选择模态框
- ✅ script.js - 翻译功能逻辑，语言选择事件
- ✅ server.js - 后端API支持targetLanguage
- ✅ styles.css - 语言选择按钮样式
- ✅ favicon.ico - 占位符文件

## 功能更新摘要
1. **"感染力表达" → "表达更具体"** 
2. **"续写" → "翻译"** (带8种语言选择)
3. **"朴实表达" → "表达更朴实"**
4. **完整的翻译语言选择UI**
5. **后端API适配翻译功能**

推送完成后，可以在 https://github.com/YanaYuan/textcraft-pro 查看更新结果。
