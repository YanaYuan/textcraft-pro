class TextOptimizer {
    constructor() {
        console.log('🔄 TextOptimizer v2.2 - Modal Integration');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCharCount();
    }

    bindEvents() {
        console.log('🔗 Binding events...');

        const inputText = document.getElementById('inputText');
        const clearBtn = document.getElementById('clearBtn');
        const functionBtns = document.querySelectorAll('.function-btn');

        const copyOpenAIBtn = document.getElementById('copyOpenAIBtn');
        const copyQwenBtn = document.getElementById('copyQwenBtn');
        const useOpenAIAsInputBtn = document.getElementById('useOpenAIAsInputBtn');
        const useQwenAsInputBtn = document.getElementById('useQwenAsInputBtn');

        console.log('📋 Found elements:', {
            inputText: !!inputText,
            clearBtn: !!clearBtn,
            functionBtns: functionBtns.length,
            copyOpenAIBtn: !!copyOpenAIBtn,
            copyQwenBtn: !!copyQwenBtn,
            useOpenAIAsInputBtn: !!useOpenAIAsInputBtn,
            useQwenAsInputBtn: !!useQwenAsInputBtn
        });

        // Modal elements
        const customModal = document.getElementById('customModal');
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        const customRequirement = document.getElementById('customRequirement');

        // Input events
        if (inputText) {
            inputText.addEventListener('input', () => this.updateCharCount());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearInput());
        }

        // Function button events
        functionBtns.forEach((btn, index) => {
            console.log(`🔘 Binding function button ${index}:`, btn.dataset.function);
            btn.addEventListener('click', () => {
                console.log('🖱️ Button clicked:', btn.dataset.function);
                const functionType = btn.dataset.function;

                // 添加特殊调试用于custom按钮
                if (functionType === 'custom') {
                    console.log('🔧 Custom button clicked - showing modal');
                }

                // 特殊处理智能建议按钮
                if (functionType === 'analysis') {
                    this.openSuggestionModal();
                } else {
                    this.handleFunction(functionType);
                }
            });
        });

        // Output actions
        if (copyOpenAIBtn) {
            copyOpenAIBtn.addEventListener('click', () => this.copyOpenAI());
        }
        if (copyQwenBtn) {
            copyQwenBtn.addEventListener('click', () => this.copyQwen());
        }
        if (useOpenAIAsInputBtn) {
            useOpenAIAsInputBtn.addEventListener('click', () => this.useOpenAIAsInput());
        }
        if (useQwenAsInputBtn) {
            useQwenAsInputBtn.addEventListener('click', () => this.useQwenAsInput());
        }

        // Modal events
        modalClose.addEventListener('click', () => this.closeModal(customModal));
        modalCancel.addEventListener('click', () => this.closeModal(customModal));
        modalConfirm.addEventListener('click', () => this.handleCustomRequirement());

        // 智能建议模态框事件
        const suggestionModal = document.getElementById('suggestionModal');
        const suggestionModalClose = document.getElementById('suggestionModalClose');
        const suggestionModalCancel = document.getElementById('suggestionModalCancel');

        suggestionModalClose.addEventListener('click', () => this.closeModal(suggestionModal));
        suggestionModalCancel.addEventListener('click', () => this.closeModal(suggestionModal));

        // 语言选择模态框事件
        const languageModal = document.getElementById('languageModal');
        const languageModalClose = document.getElementById('languageModalClose');
        const languageModalCancel = document.getElementById('languageModalCancel');
        const languageBtns = document.querySelectorAll('.language-btn');

        languageModalClose.addEventListener('click', () => this.closeModal(languageModal));
        languageModalCancel.addEventListener('click', () => this.closeModal(languageModal));

        // 语言按钮事件
        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetLanguage = btn.dataset.language;
                this.closeModal(languageModal);
                const inputText = document.getElementById('inputText').value.trim();
                this.processText('translate', inputText, targetLanguage);
            });
        });

        // 初始化属性
        this.currentCaseIndex = 0;

        // 绑定demo案例
        this.bindDemoCases();

        // Close modal on backdrop click
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) this.closeModal(customModal);
        });
        suggestionModal.addEventListener('click', (e) => {
            if (e.target === suggestionModal) this.closeModal(suggestionModal);
        });
        languageModal.addEventListener('click', (e) => {
            if (e.target === languageModal) this.closeModal(languageModal);
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(customModal);
                this.closeModal(suggestionModal);
                this.closeModal(languageModal);
            }
        });
    }

    bindDemoCases() {
        const demoBtn = document.querySelector('.demo-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.loadNextDemo();
            });
        }
    }

    // 打开智能建议模态框
    openSuggestionModal() {
        const inputText = document.getElementById('inputText').value.trim();

        if (!inputText) {
            this.showToast('请先输入要分析的文案内容', 'error');
            return;
        }

        const suggestionModal = document.getElementById('suggestionModal');
        this.openModal(suggestionModal);

        // Wait a moment for the modal to fully render before starting analysis
        setTimeout(() => {
            this.analyzeTextInModal();
        }, 100);
    }

    // 在模态框中分析文本
    async analyzeTextInModal() {
        const inputText = document.getElementById('inputText').value.trim();
        const openaiLoadingDiv = document.getElementById('openaiSuggestionLoading');
        const qwenLoadingDiv = document.getElementById('qwenSuggestionLoading');
        const openaiSuggestionsList = document.getElementById('openaiSuggestionsList');
        const qwenSuggestionsList = document.getElementById('qwenSuggestionsList');

        // 显示加载状态
        if (openaiLoadingDiv) openaiLoadingDiv.style.display = 'flex';
        if (qwenLoadingDiv) qwenLoadingDiv.style.display = 'flex';
        if (openaiSuggestionsList) openaiSuggestionsList.innerHTML = '';
        if (qwenSuggestionsList) qwenSuggestionsList.innerHTML = '';

        try {
            const dualResponse = await this.generateSuggestions(inputText);
            this.displayDualSuggestionsInModal(dualResponse);
        } catch (error) {
            console.error('Analysis error:', error);
            if (openaiSuggestionsList) {
                openaiSuggestionsList.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #666;">
                        分析失败，请稍后重试
                    </div>
                `;
            }
            if (qwenSuggestionsList) {
                qwenSuggestionsList.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #666;">
                        分析失败，请稍后重试
                    </div>
                `;
            }
        } finally {
            if (openaiLoadingDiv) openaiLoadingDiv.style.display = 'none';
            if (qwenLoadingDiv) qwenLoadingDiv.style.display = 'none';
        }
    }

    // 在模态框中显示双AI建议
    displayDualSuggestionsInModal(dualResponse) {
        console.log('🎯 Displaying dual suggestions:', dualResponse);

        // 处理 OpenAI 建议
        if (dualResponse.openai && dualResponse.openai.success) {
            const openaiSuggestions = this.parseTextSuggestions(dualResponse.openai.result);
            this.displaySuggestionsInPanel(openaiSuggestions, 'openai');
        } else {
            this.displaySuggestionError('openai', 'OpenAI 建议生成失败');
        }

        // 处理 Qwen 建议
        if (dualResponse.qwen && dualResponse.qwen.success) {
            const qwenSuggestions = this.parseTextSuggestions(dualResponse.qwen.result);
            this.displaySuggestionsInPanel(qwenSuggestions, 'qwen');
        } else {
            this.displaySuggestionError('qwen', 'Qwen 建议生成失败');
        }
    }

    // 在指定面板中显示建议
    displaySuggestionsInPanel(suggestions, aiType) {
        const suggestionsList = document.getElementById(`${aiType}SuggestionsList`);

        if (!suggestionsList) {
            console.error(`❌ Suggestions list not found for ${aiType}`);
            return;
        }

        suggestionsList.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    暂无优化建议
                </div>
            `;
            return;
        }

        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-header">
                    <span class="suggestion-type">${suggestion.type}</span>
                    <button class="suggestion-apply" onclick="textOptimizer.applySuggestion('${aiType}', ${index})">
                        应用此建议
                    </button>
                </div>
                <div class="suggestion-text">${suggestion.description}</div>
                <div class="suggestion-preview">
                    预览：${suggestion.optimizedText}
                </div>
            `;
            suggestionsList.appendChild(suggestionElement);
        });

        // 存储建议数据供后续使用
        if (!this.currentSuggestions) this.currentSuggestions = {};
        this.currentSuggestions[aiType] = suggestions;
    }

    // 显示建议错误
    displaySuggestionError(aiType, errorMessage) {
        const suggestionsList = document.getElementById(`${aiType}SuggestionsList`);
        if (suggestionsList) {
            suggestionsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    ${errorMessage}
                </div>
            `;
        }
    }

    displaySuggestionsInModal(suggestions) {
        // 这个方法现在被 displayDualSuggestionsInModal 取代
        // 但保留用于向后兼容
        console.log('⚠️ Using legacy displaySuggestionsInModal, consider using displayDualSuggestionsInModal');

        const suggestionsList = document.getElementById('modalSuggestionsList');
        if (!suggestionsList) {
            // 如果旧的元素不存在，尝试使用新的双面板结构
            this.displaySuggestionsInPanel(suggestions, 'openai');
            return;
        }

        suggestionsList.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    暂无优化建议
                </div>
            `;
            return;
        }

        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-header">
                    <span class="suggestion-type">${suggestion.type}</span>
                    <button class="suggestion-apply" onclick="textOptimizer.applyLegacySuggestion(${index})">
                        应用此建议
                    </button>
                </div>
                <div class="suggestion-text">${suggestion.description}</div>
                <div class="suggestion-preview">
                    预览：${suggestion.optimizedText}
                </div>
            `;
            suggestionsList.appendChild(suggestionElement);
        });

        // 存储建议数据供后续使用（Legacy格式）
        this.legacySuggestions = suggestions;
    }

    applyLegacySuggestion(index) {
        if (this.legacySuggestions && this.legacySuggestions[index]) {
            const suggestion = this.legacySuggestions[index];

            // 显示到右侧展示区
            this.showOutput();
            this.displayResult('suggestion', suggestion.optimizedText);

            // 关闭建议模态框
            const suggestionModal = document.getElementById('suggestionModal');
            this.closeModal(suggestionModal);

            this.showToast(`已应用${suggestion.type}建议`, 'success');
        }
    }
    // 生成优化建议
    async generateSuggestions(text) {
        const prompt = `请为以下PPT文案提供1-3个具体的优化建议。

文案内容："${text}"

请分析并提供优化建议，每个建议包含：
1. 优化类型
2. 具体建议说明
3. 优化后的文案示例

请直接以清晰的文字形式回复，不要使用JSON格式。格式示例：

建议1：简化表达
说明：当前文案过于冗长，建议精简表达，突出核心要点
优化后：[优化后的文案]

建议2：增强逻辑
说明：调整表达顺序，使逻辑更清晰，先说结论再说论据
优化后：[优化后的文案]`;

        // 使用现有的 callAPI 方法来获取双AI响应
        const response = await this.callAPI('custom', prompt, '分析PPT文案并提供优化建议');

        // 返回双AI响应结构
        return {
            openai: response.openai,
            qwen: response.qwen
        };
    }

    // 手动解析文本建议（备用方案）
    parseTextSuggestions(text) {
        console.log('🔍 Parsing text suggestions:', text);

        // 首先尝试提取JSON内容
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[0];
                const parsed = JSON.parse(jsonStr);
                if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
                    return parsed.suggestions;
                }
            }
        } catch (e) {
            console.log('📄 No valid JSON found, parsing as text...');
        }

        const suggestions = [];

        // 清理文本，移除JSON代码块和多余的格式
        let cleanText = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/\{[\s\S]*?\}/g, '') // 移除JSON代码块
            .trim();

        // 按"建议"关键词分割
        const suggestionBlocks = cleanText.split(/建议\s*\d+[：:]/i).filter(block => block.trim());

        for (let i = 0; i < suggestionBlocks.length; i++) {
            const block = suggestionBlocks[i].trim();
            if (!block) continue;

            let type = '表达优化';
            let description = '';
            let optimizedText = '';

            // 分析每个建议块
            const lines = block.split('\n').map(l => l.trim()).filter(l => l);

            for (const line of lines) {
                // 识别建议类型
                if (line.includes('简化') || line.includes('精简')) {
                    type = '简化表达';
                } else if (line.includes('扩展') || line.includes('详细') || line.includes('丰富')) {
                    type = '内容扩展';
                } else if (line.includes('逻辑') || line.includes('顺序')) {
                    type = '逻辑优化';
                } else if (line.includes('视觉') || line.includes('展示') || line.includes('PPT')) {
                    type = '视觉效果';
                } else if (line.includes('感染力') || line.includes('情感')) {
                    type = '感染力提升';
                }

                // 解析不同部分
                if (line.includes('说明') && line.includes('：')) {
                    description = line.replace(/^说明[：:]/i, '').trim();
                } else if (line.includes('优化后') && line.includes('：')) {
                    optimizedText = line.replace(/^优化后[：:]/i, '').replace(/^\[/, '').replace(/\]$/, '').trim();
                } else if (line.includes('修改为') && line.includes('：')) {
                    optimizedText = line.replace(/^修改为[：:]/i, '').trim();
                } else if (!description && line.length > 10 && !line.includes('建议') && !line.includes('优化后')) {
                    // 可能是描述文本
                    description = line;
                } else if (!optimizedText && line.length > 5 && line !== description) {
                    // 可能是优化后的文本
                    optimizedText = line;
                }
            }

            // 如果解析成功，添加建议
            if (description || optimizedText) {
                suggestions.push({
                    type: type,
                    description: description || '建议优化文案表达方式，使其更适合PPT展示',
                    optimizedText: optimizedText || document.getElementById('inputText').value.trim()
                });
            }
        }

        // 如果还是没有提取到有效建议，尝试其他方法
        if (suggestions.length === 0) {
            // 按段落分析
            const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim());

            for (const paragraph of paragraphs) {
                if (paragraph && paragraph.length > 20) {
                    const firstLine = paragraph.split('\n')[0];
                    suggestions.push({
                        type: '表达优化',
                        description: '建议优化文案的表达方式，使其更适合PPT展示',
                        optimizedText: firstLine || paragraph.substring(0, 100)
                    });
                }
            }
        }

        // 最后的兜底方案
        if (suggestions.length === 0) {
            const inputText = document.getElementById('inputText').value.trim();
            suggestions.push({
                type: '表达优化',
                description: '建议优化文案的表达方式，使其更简洁清晰，更适合PPT展示',
                optimizedText: inputText
            });
        }

        console.log('✅ Parsed suggestions:', suggestions);
        return suggestions;
    }

    // 应用单个建议（更新为支持双AI）
    applySuggestion(aiType, index) {
        if (!this.currentSuggestions || !this.currentSuggestions[aiType]) {
            console.error(`❌ No suggestions found for ${aiType}`);
            return;
        }

        const suggestion = this.currentSuggestions[aiType][index];
        if (!suggestion) {
            console.error(`❌ Suggestion ${index} not found for ${aiType}`);
            return;
        }

        // 显示到右侧展示区
        this.showOutput();
        this.displaySingleSuggestionResult(suggestion, aiType);

        // 关闭建议模态框
        const suggestionModal = document.getElementById('suggestionModal');
        this.closeModal(suggestionModal);

        this.showToast(`已应用${aiType.toUpperCase()}的${suggestion.type}建议`, 'success');
    }

    // 显示单个建议结果
    displaySingleSuggestionResult(suggestion, aiType) {
        const outputTitle = document.getElementById('outputTitle');
        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');

        if (outputTitle) {
            outputTitle.textContent = `${suggestion.type} - ${aiType.toUpperCase()} 建议`;
        }

        // 清空两个结果面板
        if (openaiResult) {
            openaiResult.textContent = '';
            openaiResult.style.display = 'none';
        }
        if (qwenResult) {
            qwenResult.textContent = '';
            qwenResult.style.display = 'none';
        }

        // 在对应的面板显示建议结果
        const targetResult = document.getElementById(`${aiType.toLowerCase()}Result`);
        if (targetResult) {
            targetResult.textContent = suggestion.optimizedText;
            targetResult.style.color = '#1d1d1f';
            targetResult.style.display = 'block';
        }

        this.enableOutputButtons();
    }

    // 按顺序加载下一个demo案例
    loadNextDemo() {        
        const demoCases = [
            {
                text: "我们的产品很好用，功能也很多，用户反馈不错，市场表现也还可以。",
                functions: ['optimize'],
                type: 'PPT产品介绍'
            },
            {
                text: "提升效率。",
                functions: ['expand'],
                type: 'PPT要点扩展'
            },
            {
                text: "我们通过深度学习算法、神经网络架构优化、大规模数据训练、模型参数调优、推理加速技术、分布式计算框架等多种先进技术手段，实现了人工智能系统的全面升级和性能提升。",
                functions: ['summarize'],
                type: 'PPT内容精简'
            },
            {
                text: "我们运用了最先进的人工智能技术和深度学习算法来实现这个功能。",
                functions: ['simplify'],
                type: 'PPT朴实表达'
            },
            {
                text: "这个项目可以帮助公司节省成本，提高工作效率。",
                functions: ['emotional'],
                type: 'PPT内容具体化'
            },
            {
                text: "Our product is easy to use and has many features. Users give positive feedback and market performance is good.",
                functions: ['translate'],
                type: 'PPT英文翻译'
            },
            {
                text: "我们团队在过去一年里完成了很多项目取得了不错的成绩客户满意度也很高希望今年能继续保持。",
                functions: ['check'],
                type: 'PPT错误检查'
            },
            {
                text: "用户体验需要优化。",
                functions: ['custom'],
                type: 'PPT自定义优化'
            }
        ];

        // 按顺序选择案例
        const currentCase = demoCases[this.currentCaseIndex];

        // 更新索引，循环到下一个案例
        this.currentCaseIndex = (this.currentCaseIndex + 1) % demoCases.length;

        // 填充到输入框
        const inputTextArea = document.getElementById('inputText');
        if (inputTextArea) {
            inputTextArea.value = currentCase.text;
            this.updateCharCount();

            // 添加动画效果
            inputTextArea.style.backgroundColor = '#f0f8ff';
            setTimeout(() => {
                inputTextArea.style.backgroundColor = '';
            }, 500);

            // 高亮推荐功能
            this.highlightRecommendedFunctions(currentCase.functions);

            // 显示提示
            const recommendedText = this.getFunctionNames(currentCase.functions)[0]; // 只取第一个功能名称
            // this.showToast(`✨ ${currentCase.type}案例已加载！推荐使用：${recommendedText}`, 'success');

            // 滚动到输入框
            inputTextArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            inputTextArea.focus();
        }
    }

    highlightRecommendedFunctions(recommendedFunctions) {
        // 先移除所有高亮
        document.querySelectorAll('.function-btn').forEach(btn => {
            btn.classList.remove('recommended');
        });

        // 添加推荐功能的高亮
        recommendedFunctions.forEach(funcType => {
            const btn = document.querySelector(`[data-function="${funcType}"]`);
            if (btn) {
                btn.classList.add('recommended');

                // 3秒后移除高亮
                setTimeout(() => {
                    btn.classList.remove('recommended');
                }, 3000);
            }
        });
    }

    getFunctionNames(functionTypes) {
        const names = {
            optimize: '优化表达',
            expand: '扩写',
            summarize: '缩写',
            simplify: '表达更朴实',
            emotional: '表达更具体',
            translate: '翻译',
            check: '检查错误',
            custom: '自定义修改'
        };

        return functionTypes.map(type => names[type] || type);
    }

    updateCharCount() {
        const charCount = document.querySelector('.char-count');
        const length = inputText.value.length;
        charCount.textContent = `${length} / 2000`;

        if (length > 2000) {
            charCount.style.color = '#ff3b30';
        } else if (length > 1800) {
            charCount.style.color = '#ff9500';
        } else {
            charCount.style.color = '#86868b';
        }
    }

    clearInput() {
        document.getElementById('inputText').value = '';
        this.updateCharCount();
        this.hideOutput();
    }

    handleFunction(functionType) {
        console.log('🎯 Function button clicked:', functionType);

        const inputText = document.getElementById('inputText').value.trim();
        console.log('📝 Input text:', inputText);

        if (!inputText) {
            console.log('❌ No input text provided');
            this.showToast('请先输入要处理的文本');
            return;
        }

        console.log('✅ Processing function:', functionType);

        if (functionType === 'custom') {
            this.showCustomModal();
        } else if (functionType === 'translate') {
            this.showLanguageModal();
        } else {
            this.processText(functionType, inputText);
        }
    }

    showCustomModal() {
        const modal = document.getElementById('customModal');
        modal.classList.add('show');
        document.getElementById('customRequirement').focus();
    }

    showLanguageModal() {
        const modal = document.getElementById('languageModal');
        modal.classList.add('show');
    }

    openModal(modal) {
        modal.classList.add('show');
    }

    closeModal(modal) {
        modal.classList.remove('show');
    }

    handleCustomRequirement() {
        const requirement = document.getElementById('customRequirement').value.trim();
        const inputText = document.getElementById('inputText').value.trim();

        if (!requirement) {
            this.showToast('请输入自定义需求');
            return;
        }

        this.closeModal(document.getElementById('customModal'));
        this.processText('custom', inputText, requirement);
        document.getElementById('customRequirement').value = '';
    }

    async processText(functionType, text, extra = '') {
        // 验证输入文本
        if (!text || text.trim() === '') {
            this.showToast('❌ 请先输入要处理的文案内容', 'error');
            return;
        }

        this.showOutput();
        this.showLoading();

        try {
            console.log('🎯 Starting text processing:', { functionType, textLength: text.length, extra });

            const result = await this.callAPI(functionType, text, extra);
            console.log('🎉 Processing completed successfully');

            this.showToast('✅ AI处理完成！', 'success');

        } catch (error) {
            console.error('💥 Processing error:', error);

            setTimeout(() => {
                const errorMessage = error.message.includes('fetch') 
                    ? 'AI服务连接失败，请检查网络连接'
                    : 'AI处理失败：' + error.message;

                this.displayError(errorMessage);
                this.hideLoading();
                this.showToast('❌ AI处理失败，请重试', 'error');
            }, 500);
        }
    }

    async callAPI(functionType, text, extra) {
        console.log('🚀 Calling API:', { functionType, text, extra });

        try {
            const requestBody = {
                text: text,
                type: functionType
            };

            // 添加额外参数
            if (functionType === 'custom' && extra) {
                requestBody.customPrompt = extra;
            }

            // 添加翻译目标语言参数
            if (functionType === 'translate' && extra) {
                requestBody.targetLanguage = extra;
            }

            console.log('📤 Sending request:', requestBody);

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Response:', data);

            if (data.success) {
                console.log('🎉 Processing dual AI results with streaming display');

                this.displayStreamingResults(functionType, data);

                return data; // Return the full data object with both results
            } else {
                console.error('❌ API returned error:', data.error);
                throw new Error(data.error || 'API call failed');
            }
        } catch (error) {
            console.error('💥 API call failed completely:', error);
            // 重新抛出错误，不要使用模拟结果
            throw error;
        }
    }

    displayStreamingResults(functionType, data) {
        console.log('🌊 Streaming results display:', { functionType, data });

        const functionTitles = {
            optimize: '优化表达结果',
            expand: '扩写结果',
            summarize: '缩写结果',
            simplify: '表达更朴实结果',
            emotional: '表达更具体结果',
            translate: '翻译结果',
            check: '错误检查结果',
            custom: '自定义修改结果'
        };

        const outputTitle = document.getElementById('outputTitle');
        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');
        const openaiLoading = document.getElementById('openaiLoading');
        const qwenLoading = document.getElementById('qwenLoading');

        if (outputTitle) {
            outputTitle.textContent = functionTitles[functionType] || '处理结果';
        }

        if (openaiResult && qwenResult && openaiLoading && qwenLoading) {
            // OpenAI结果处理
            if (data.openai && data.openai.success) {
                console.log('Displaying OpenAI result');
                openaiLoading.style.display = 'none';
                openaiResult.style.display = 'block';
                openaiResult.textContent = data.openai.result;
                openaiResult.style.color = '#1d1d1f';
            } else {
                console.log('OpenAI failed');
                openaiLoading.style.display = 'none';
                openaiResult.style.display = 'block';
                openaiResult.textContent = data.openai ? data.openai.result : 'OpenAI API 连接失败';
                openaiResult.style.color = '#ff3b30';
            }

            // Qwen结果处理
            if (data.qwen && data.qwen.success) {
                console.log('Displaying Qwen result');
                qwenLoading.style.display = 'none';
                qwenResult.style.display = 'block';
                qwenResult.textContent = data.qwen.result;
                qwenResult.style.color = '#1d1d1f';
            } else {
                console.log('Qwen failed');
                qwenLoading.style.display = 'none';
                qwenResult.style.display = 'block';
                qwenResult.textContent = data.qwen ? data.qwen.result : 'Qwen API 连接失败';
                qwenResult.style.color = '#ff3b30';
            }

            this.enableOutputButtons();

            console.log('Streaming results displayed successfully');
        } else {
            console.error('Result elements not found!');
        }
    }

    // 显示错误信息
    displayError(errorMessage) {
        console.log('❌ Displaying error message:', errorMessage);

        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');

        if (openaiResult && qwenResult) {
            openaiResult.textContent = errorMessage;
            openaiResult.style.color = '#ff3b30';
            openaiResult.style.display = 'block';

            qwenResult.textContent = errorMessage;
            qwenResult.style.color = '#ff3b30';
            qwenResult.style.display = 'block';
        }
    }

    getMockResults(functionType, text, extra) {
        const mockResults = {
            optimize: `【优化后的表达】\n\n${text}\n\n经过语言优化，这段文字在保持原意的基础上，提升了表达的准确性和流畅度。调整了语序，优化了用词，使内容更加易读易懂。`,

            expand: `【扩写版本】\n\n${text}\n\n为了让内容更加丰富详实，我们可以从多个维度来深入阐述。首先，从背景角度来看，这个话题具有重要的现实意义。其次，从具体实施层面分析，需要考虑各种因素的影响。此外，我们还应该关注长远的发展趋势和潜在的挑战。通过这样的深入分析，我们可以得出更加全面和有价值的结论。`,

            summarize: `【精简版本】\n\n${text.length > 50 ? text.substring(0, 50) + '...' : text}\n\n核心要点：保持原文主要信息，去除冗余表达，突出关键内容。`,

            simplify: `【朴实表达】\n\n${text}\n\n这段话用更简单的方式来说就是：用大家都能听懂的话来表达同样的意思，不用复杂的词汇，让每个人都能轻松理解。`,

            emotional: `【表达更具体】\n\n${text}\n\n具体化表达：这个项目预计每年为公司节省运营成本约15-20%，相当于节省200-300万元。通过自动化流程，员工工作效率提升35%，原本需要2小时的任务现在只需45分钟完成。实施后，客户满意度从78%提升至92%，投资回报率达到180%。`,

            translate: `【翻译结果】\n\n原文：${text}\n\n译文：我们的产品易于使用，功能丰富。用户反馈积极，市场表现良好。`,

            check: `【错误检查结果】\n\n原文：${text}\n\n✅ 检查完成！\n\n发现的问题：\n• 建议将某些表达方式进行优化\n• 个别标点符号使用可以更规范\n• 整体语言流畅度良好\n\n修正建议：保持现有表达风格，注意标点符号的准确使用。`,

            custom: `【根据您的需求修改】\n\n原文：${text}\n\n您的需求：${extra}\n\n修改后：${text}（已根据"${extra}"的要求进行调整，在保持原意的基础上，按照您的具体需求对表达方式、语气、风格等方面进行了相应的优化和改进。）`
        };

        return mockResults[functionType] || '处理完成';
    }

    getTranslationResult(text, language) {
        const languages = {
            en: { name: 'English', sample: 'This is the English translation of your text.' },
            ja: { name: '日本語', sample: 'これはあなたのテキストの日本語翻訳です。' },
            ko: { name: '한국어', sample: '이것은 귀하의 텍스트의 한국어 번역입니다.' },
            fr: { name: 'Français', sample: 'Ceci est la traduction française de votre texte.' },
            de: { name: 'Deutsch', sample: 'Dies ist die deutsche Übersetzung Ihres Textes.' },
            es: { name: 'Español', sample: 'Esta es la traducción al español de su texto.' },
            ru: { name: 'Русский', sample: 'Это русский перевод вашего текста.' },
            ar: { name: 'العربية', sample: 'هذه هي الترجمة العربية لنصك.' }
        };

        const targetLang = languages[language] || languages.en;
        return `【翻译为${targetLang.name}】\n\n原文：${text}\n\n译文：${targetLang.sample}\n\n注：实际应用中这里会显示真实的翻译结果。`;
    }

    showOutput() {
        console.log('👁️ Showing output section...');

        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');

        console.log('🔍 Output section elements:', {
            outputPlaceholder: !!outputPlaceholder,
            outputContent: !!outputContent
        });

        if (outputPlaceholder && outputContent) {
            outputPlaceholder.style.display = 'none';
            outputContent.style.display = 'flex';

            // 重置编辑状态，确保显示新结果时回到正常模式
            this.resetEditState();

            console.log('✅ Output section shown');
        } else {
            console.error('❌ Output section elements not found!');
        }
    }

    showLoading() {
        console.log('⏳ Starting loading...');

        const openaiLoading = document.getElementById('openaiLoading');
        const qwenLoading = document.getElementById('qwenLoading');
        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');

        if (openaiLoading && qwenLoading) {
            openaiLoading.style.display = 'flex';
            qwenLoading.style.display = 'flex';
            openaiResult.style.display = 'none';
            qwenResult.style.display = 'none';
        }

        // 禁用输出区域的操作按钮
        this.disableOutputButtons();
    }

    hideLoading() {
        console.log('✅ Hiding loading...');

        const openaiLoading = document.getElementById('openaiLoading');
        const qwenLoading = document.getElementById('qwenLoading');
        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');

        if (openaiLoading && qwenLoading) {
            openaiLoading.style.display = 'none';
            qwenLoading.style.display = 'none';
            openaiResult.style.display = 'block';
            qwenResult.style.display = 'block';
        }

        // 重新启用输出区域的操作按钮
        this.enableOutputButtons();
    }

    displayResult(functionType, data) {
        console.log('🎨 Displaying result:', { functionType, data });

        const functionTitles = {
            optimize: '优化表达结果',
            expand: '扩写结果',
            summarize: '缩写结果',
            simplify: '表达更朴实结果',
            emotional: '表达更具体结果',
            translate: '翻译结果',
            check: '错误检查结果',
            custom: '自定义修改结果'
        };

        const outputTitle = document.getElementById('outputTitle');
        const openaiResult = document.getElementById('openaiResult');
        const qwenResult = document.getElementById('qwenResult');

        if (outputTitle) {
            outputTitle.textContent = functionTitles[functionType] || '处理结果';
        }

        if (openaiResult && qwenResult) {
            // 显示OpenAI结果
            if (data.openai && data.openai.success) {
                openaiResult.textContent = data.openai.result;
                openaiResult.style.color = '#1d1d1f';
            } else {
                openaiResult.textContent = data.openai ? data.openai.result : 'OpenAI API 连接失败';
                openaiResult.style.color = '#ff3b30';
            }

            // 显示Qwen结果
            if (data.qwen && data.qwen.success) {
                qwenResult.textContent = data.qwen.result;
                qwenResult.style.color = '#1d1d1f';
            } else {
                qwenResult.textContent = data.qwen ? data.qwen.result : 'Qwen API 连接失败';
                qwenResult.style.color = '#ff3b30';
            }

            console.log('✅ Dual results displayed successfully');
        } else {
            console.error('❌ Result elements not found!');
        }
    }

    // 禁用输出区域的操作按钮
    disableOutputButtons() {
        const copyOpenAIBtn = document.getElementById('copyOpenAIBtn');
        const copyQwenBtn = document.getElementById('copyQwenBtn');
        const useOpenAIAsInputBtn = document.getElementById('useOpenAIAsInputBtn');
        const useQwenAsInputBtn = document.getElementById('useQwenAsInputBtn');

        [copyOpenAIBtn, copyQwenBtn, useOpenAIAsInputBtn, useQwenAsInputBtn].forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
    }

    // 启用输出区域的操作按钮
    enableOutputButtons() {
        const copyOpenAIBtn = document.getElementById('copyOpenAIBtn');
        const copyQwenBtn = document.getElementById('copyQwenBtn');
        const useOpenAIAsInputBtn = document.getElementById('useOpenAIAsInputBtn');
        const useQwenAsInputBtn = document.getElementById('useQwenAsInputBtn');

        [copyOpenAIBtn, copyQwenBtn, useOpenAIAsInputBtn, useQwenAsInputBtn].forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });
    }

    // 设置编辑按钮的状态（图标和文本）
    setEditButtonState(isEditing) {
        const editBtn = document.getElementById('editBtn');
        if (!editBtn) return;

        if (isEditing) {
            // 编辑模式：显示保存/确认图标和文本
            editBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" fill="currentColor"/>
                </svg>
                完成
            `;
        } else {
            // 正常模式：显示编辑图标和文本
            editBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" fill="currentColor"/>
                    <path d="m5.21 11.5 1.086 1.086" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                编辑
            `;
        }
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        // 移除现有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // 逐个设置样式属性，避免样式冲突
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.background = type === 'success' ? '#2d2d2d' : type === 'error' ? '#1a1a1a' : '#333333';
        toast.style.color = 'white';
        toast.style.padding = '10px 16px';
        toast.style.borderRadius = '6px';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        toast.style.zIndex = '1000';
        toast.style.maxWidth = '300px';
        toast.style.width = 'auto';
        toast.style.height = 'auto';
        toast.style.minHeight = 'auto';
        toast.style.opacity = '1';
        toast.style.lineHeight = '1.4';
        toast.style.pointerEvents = 'none';
        toast.style.display = 'inline-block';
        toast.style.whiteSpace = 'normal';
        toast.style.wordWrap = 'break-word';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'transform 0.3s ease';

        // 强制清除可能影响高度的属性
        toast.style.margin = '0';
        toast.style.border = 'none';
        toast.style.outline = 'none';
        toast.style.boxSizing = 'border-box';

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    async copyOpenAI() {
        const openaiResult = document.getElementById('openaiResult').textContent;

        try {
            await navigator.clipboard.writeText(openaiResult);
            this.showToast('OpenAI结果已复制到剪贴板');
        } catch (error) {
            this.fallbackCopy(openaiResult, 'OpenAI结果');
        }
    }

    async copyQwen() {
        const qwenResult = document.getElementById('qwenResult').textContent;

        try {
            await navigator.clipboard.writeText(qwenResult);
            this.showToast('Qwen结果已复制到剪贴板');
        } catch (error) {
            this.fallbackCopy(qwenResult, 'Qwen结果');
        }
    }

    useOpenAIAsInput() {
        const openaiResult = document.getElementById('openaiResult').textContent;
        const inputTextArea = document.getElementById('inputText');

        inputTextArea.value = openaiResult;
        this.updateCharCount();
        this.hideOutput();

        inputTextArea.focus();
        this.showToast('已将OpenAI结果设为新的输入文本');
    }

    useQwenAsInput() {
        const qwenResult = document.getElementById('qwenResult').textContent;
        const inputTextArea = document.getElementById('inputText');

        inputTextArea.value = qwenResult;
        this.updateCharCount();
        this.hideOutput();

        inputTextArea.focus();
        this.showToast('已将Qwen结果设为新的输入文本');
    }

    // Fallback copy method for older browsers
    fallbackCopy(text, resultType) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast(`${resultType}已复制到剪贴板`);
        } catch (err) {
            this.showToast(`${resultType}复制失败，请手动复制`);
        }

        document.body.removeChild(textArea);
    }

    hideOutput() {
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');

        outputPlaceholder.style.display = 'flex';
        outputContent.style.display = 'none';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing TextOptimizer...');

    // 检查关键元素是否存在
    const inputText = document.getElementById('inputText');
    const functionBtns = document.querySelectorAll('.function-btn');

    console.log('🔍 Element check:', {
        inputText: !!inputText,
        functionButtons: functionBtns.length,
        optimizeButton: !!document.querySelector('[data-function="optimize"]')
    });

    if (!inputText) {
        console.error('❌ Input text element not found!');
        return;
    }

    if (functionBtns.length === 0) {
        console.error('❌ No function buttons found!');
        return;
    }

    try {
        const optimizer = new TextOptimizer();
        console.log('✅ TextOptimizer initialized successfully');

        // 全局调试
        window.textOptimizer = optimizer;

    } catch (error) {
        console.error('❌ Failed to initialize TextOptimizer:', error);
    }

    // 添加拖拽上传文本文件支持
    const inputContainer = document.querySelector('.input-container');
    const inputTextArea = document.getElementById('inputText');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        inputContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        inputContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        inputContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        inputContainer.style.borderColor = '#007AFF';
        inputContainer.style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
    }

    function unhighlight() {
        inputContainer.style.borderColor = '';
        inputContainer.style.backgroundColor = '';
    }

    inputContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];

            // 检查文件类型
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const text = e.target.result;
                    if (text.length <= 2000) {
                        inputTextArea.value = text;
                        if (window.textOptimizer) {
                            window.textOptimizer.updateCharCount();
                            window.textOptimizer.showToast('文件内容已导入');
                        }
                    } else {
                        if (window.textOptimizer) {
                            window.textOptimizer.showToast('文件内容过长，请确保在2000字符以内');
                        }
                    }
                };

                reader.readAsText(file, 'UTF-8');
            } else {
                if (window.textOptimizer) {
                    window.textOptimizer.showToast('请拖拽文本文件(.txt)');
                }
            }
        }
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter 快速优化
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const optimizeBtn = document.querySelector('[data-function="optimize"]');
            if (optimizeBtn) {
                console.log('🎯 Keyboard shortcut: Triggering optimize');
                optimizeBtn.click();
            }
        }

        // Ctrl/Cmd + L 清空输入
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const clearBtn = document.getElementById('clearBtn');
            if (clearBtn) clearBtn.click();
        }
    });
});

if (typeof TextOptimizer !== 'undefined') {
    TextOptimizer.prototype.resetEditState = function() {
        if (typeof this.enableOutputButtons === 'function') {
            this.enableOutputButtons();
        }
    };
}
