# TextCraft Pro v2.0 🚀

## 项目简介

TextCraft Pro 是一个基于 AI 的智能文本优化平台，集成了 Azure OpenAI GPT-4o 模型，为用户提供8种专业的文本处理功能和智能PPT优化建议。

![TextCraft Pro](https://via.placeholder.com/800x400/667eea/ffffff?text=TextCraft+Pro)

## ✨ 主要特性

### 🎯 核心功能
- **优化表达** - 让文案更清晰、简洁、有说服力
- **智能扩写** - 添加适量细节和内容
- **精准缩写** - 简明扼要表达核心内容
- **朴实表达** - 简化表达方式，提高可读性
- **感染力表达** - 增加情感色彩，提升感染力
- **智能续写** - 基于上下文的自然续写
- **错误检查** - 识别用词错误和表达不当
- **自定义优化** - 根据特定需求定制处理

### 🧠 智能建议系统
- **PPT文案分析** - 智能分析演示文稿内容
- **个性化建议** - 提供针对性的优化建议
- **模态窗口展示** - 清晰的建议列表界面
- **单独应用** - 可选择性应用每条建议

### 🎨 设计特色
- **Apple风格** - 玻璃拟态设计，现代简约
- **响应式布局** - 完美适配各种设备尺寸
- **布局优化** - 固定高度，防止长文本拉伸页面
- **动效交互** - 流畅的动画和过渡效果

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + JavaScript ES6
- **后端**: Node.js + Azure OpenAI API
- **部署**: Vercel + GitHub
- **AI模型**: Azure OpenAI GPT-4o
- **设计**: Apple Glassmorphism

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/your-username/textcraft-pro.git
cd textcraft-pro
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
- 在 `api/optimize.js` 中配置您的 Azure OpenAI API 密钥

4. **启动服务**
```bash
npm start
```

5. **访问应用**
```
http://localhost:8000
```

### Vercel 部署

1. **导入项目** - 在 Vercel 中连接 GitHub 仓库
2. **自动部署** - Vercel 将自动检测配置并部署
3. **环境变量** - 在 Vercel 面板中配置 Azure OpenAI 密钥

## 📁 项目结构

```
textcraft-pro/
├── public/                 # 静态文件
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   └── script.js          # 客户端脚本
├── api/                   # Vercel API 路由
│   └── optimize.js        # 文本优化 API
├── backup_v2.0_layout_fixed/  # 版本备份
├── server.js              # 本地开发服务器
├── package.json           # 项目配置
├── vercel.json           # Vercel 部署配置
└── README.md             # 项目文档
```

## 🎮 使用指南

### 基础功能
1. 在输入框中输入要处理的文本
2. 点击对应的功能按钮
3. 查看AI处理后的结果
4. 可复制结果或设为新输入

### 演示案例
- 点击"试试这些案例"按钮
- 系统会自动填入示例文本
- 推荐的功能按钮会高亮显示
- 包含完整的用户引导流程

### 智能建议
1. 输入PPT相关文案
2. 点击"智能建议"按钮
3. 在弹窗中查看优化建议
4. 单独应用需要的建议

## 🔧 API 接口

### POST /api/optimize

**请求参数:**
```json
{
  "text": "要处理的文本",
  "type": "功能类型",
  "customPrompt": "自定义提示词(可选)",
  "targetLanguage": "目标语言(翻译功能)"
}
```

**响应格式:**
```json
{
  "success": true,
  "result": "处理后的文本"
}
```

## 🎯 版本历史

### v2.0 (当前版本)
- ✅ 修复长文本导致页面拉伸问题
- ✅ 完善响应式布局设计
- ✅ 优化推荐功能高亮样式
- ✅ 移除翻译功能，精简核心功能
- ✅ 增强智能建议系统

### v1.0 
- ✅ 基础8种文本优化功能
- ✅ Azure OpenAI 集成
- ✅ Apple风格UI设计
- ✅ 演示案例系统

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 支持

如有问题或建议，请：
- 提交 [GitHub Issue](https://github.com/your-username/textcraft-pro/issues)
- 发送邮件至 support@textcraft.pro

---

**TextCraft Pro** - 让AI为您的文案插上翅膀 ✨
