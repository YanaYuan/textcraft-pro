# 版本管理和回滚指南

## 当前稳定版本：v1.2.0

### 版本特性
- ✅ "感染力表达" → "表达更具体"
- ✅ "续写" → "翻译"功能（支持8种语言）
- ✅ "朴实表达" → "表达更朴实"
- ✅ 完整的语言选择模态框UI
- ✅ 修复了CSS样式问题
- ✅ 所有功能在Vercel部署后正常工作

### 如何回滚到这个版本

#### 方法1：使用标签回滚
```bash
# 回滚到v1.2.0版本
git checkout v1.2.0

# 创建新分支保存当前状态（可选）
git checkout -b rollback-to-v1.2.0

# 强制推送到main分支（谨慎使用）
git checkout main
git reset --hard v1.2.0
git push origin main --force
```

#### 方法2：在GitHub上操作
1. 访问 https://github.com/YanaYuan/textcraft-pro/releases
2. 找到 v1.2.0 版本
3. 下载源代码或创建新的发布版本

#### 方法3：使用VS Code
1. 在VS Code中打开源代码管理面板
2. 查看提交历史
3. 右键点击v1.2.0标签对应的提交
4. 选择"Reset Current Branch to Commit"

### 查看版本历史
```bash
# 查看所有标签
git tag -l

# 查看标签详情
git show v1.2.0

# 查看提交历史
git log --oneline --graph --decorate --all
```

### 版本发布记录
- **v1.2.0** (2025-07-13): 完成功能更新，修复样式问题
- 未来版本将继续在此基础上迭代

### 注意事项
- 强制推送 (`--force`) 会覆盖远程仓库历史，请谨慎使用
- 建议在回滚前备份当前代码
- 如果在Vercel上部署，回滚后需要重新部署
