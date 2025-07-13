# GitHub重新登录步骤

## 当前问题
- VS Code中GitHub账户已登出
- Git推送失败，需要重新认证

## 解决步骤

### 方法1：通过VS Code重新登录
1. 按 `Ctrl + Shift + P` 打开命令面板
2. 输入 "GitHub: Sign in"
3. 选择并执行命令
4. 在浏览器中完成YanaYuan账户登录

### 方法2：通过账户管理器
1. 点击VS Code左下角的账户图标
2. 选择 "Sign in to GitHub"
3. 完成登录流程

### 方法3：使用源代码管理面板
1. 点击左侧的源代码管理图标 (Ctrl + Shift + G)
2. 如果看到登录提示，点击登录
3. 完成GitHub认证

## 登录成功后的推送步骤
```bash
# 检查状态
git status

# 如果有未提交的更改，先提交
git add -A
git commit -m "完成功能修改：表达更具体、翻译功能、表达更朴实"

# 推送到GitHub
git push origin main
```

## 验证推送成功
- 访问 https://github.com/YanaYuan/textcraft-pro
- 确认最新提交已经出现在仓库中
- 检查所有修改的文件都已同步

## 已修改的文件
- index.html (功能按钮更新，语言选择模态框)
- script.js (翻译功能逻辑，语言选择事件) 
- server.js (后端API支持targetLanguage)
- styles.css (语言选择按钮样式)
- favicon.ico (占位符文件)

完成登录后，请告诉我，我会继续帮你推送代码。
