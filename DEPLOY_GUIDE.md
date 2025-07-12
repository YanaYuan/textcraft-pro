# GitHub上传指南

## 方法1: 使用GitHub Desktop (推荐)
1. 下载安装 GitHub Desktop: https://desktop.github.com/
2. 登录GitHub账号
3. File → Add Local Repository → 选择项目文件夹
4. Publish repository

## 方法2: 命令行上传
在GitHub创建仓库后，运行以下命令：

```bash
# 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到GitHub（会提示输入用户名和token）
git branch -M main
git push -u origin main
```

## 方法3: 手动上传
1. 在GitHub创建新仓库
2. 直接拖拽文件到仓库页面
3. 填写提交信息并确认

## Vercel部署步骤
1. 访问 https://vercel.com
2. 用GitHub账号登录
3. Import Project → 选择您的仓库
4. 在环境变量中添加 Azure OpenAI 密钥
5. 部署完成！

## 需要配置的环境变量
- AZURE_OPENAI_KEY: 您的Azure OpenAI API密钥
- AZURE_OPENAI_ENDPOINT: API端点地址
