class TextOptimizer {
    constructor() {
        console.log('🔄 TextOptimizer v2.1 - Modal Integration');
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
        const copyBtn = document.getElementById('copyBtn');
        const useAsInputBtn = document.getElementById('useAsInputBtn');
        
        console.log('📋 Found elements:', {
            inputText: !!inputText,
            clearBtn: !!clearBtn,
            functionBtns: functionBtns.length,
            copyBtn: !!copyBtn,
            useAsInputBtn: !!useAsInputBtn
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
        const editBtn = document.getElementById('editBtn');
        editBtn.addEventListener('click', () => this.toggleEdit());
        copyBtn.addEventListener('click', () => this.copyOutput());
        useAsInputBtn.addEventListener('click', () => this.useOutputAsInput());

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
        
        // 开始分析
        this.analyzeTextInModal();
    }

    // 在模态框中分析文本
    async analyzeTextInModal() {
        const inputText = document.getElementById('inputText').value.trim();
        const loadingDiv = document.getElementById('suggestionLoading');
        const suggestionsList = document.getElementById('modalSuggestionsList');
        
        // 显示加载状态
        loadingDiv.style.display = 'flex';
        suggestionsList.innerHTML = '';
        
        try {
            const suggestions = await this.generateSuggestions(inputText);
            this.displaySuggestionsInModal(suggestions);
        } catch (error) {
            console.error('Analysis error:', error);
            suggestionsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    分析失败，请稍后重试
                </div>
            `;
        } finally {
            loadingDiv.style.display = 'none';
        }
    }

    // 在模态框中显示建议
    displaySuggestionsInModal(suggestions) {
        const suggestionsList = document.getElementById('modalSuggestionsList');
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
                    <button class="suggestion-apply" onclick="textOptimizer.applySuggestion(${index})">
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
        this.currentSuggestions = suggestions;
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

        const response = await fetch('/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: prompt,
                type: 'custom',
                customPrompt: '分析PPT文案并提供优化建议'
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        try {
            // 尝试解析AI返回的JSON（如果有的话）
            const parsed = JSON.parse(data.result);
            if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
                return parsed.suggestions;
            }
        } catch (e) {
            // AI返回的是文本格式，使用改进的解析方法
            console.log('🔄 Parsing AI text response...');
        }
        
        // 解析文本格式的回复
        return this.parseTextSuggestions(data.result);
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
                if (paragraph.length > 20) {
                    suggestions.push({
                        type: '表达优化',
                        description: '建议优化文案的表达方式，使其更适合PPT展示',
                        optimizedText: paragraph.split('\n')[0] || paragraph.substring(0, 100)
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

    // 应用单个建议
    applySuggestion(index) {
        if (this.currentSuggestions && this.currentSuggestions[index]) {
            const suggestion = this.currentSuggestions[index];
            
            // 显示到右侧展示区
            this.showOutput();
            this.displayResult('suggestion', suggestion.optimizedText);
            
            // 关闭建议模态框
            const suggestionModal = document.getElementById('suggestionModal');
            this.closeModal(suggestionModal);
            
            this.showToast(`已应用${suggestion.type}建议`, 'success');
        }
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
            this.showToast(`✨ ${currentCase.type}案例已加载！推荐使用：${recommendedText}`, 'success');
            
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
        
        return functionTypes.map(type => names[type] || type).join('、');
    }

    updateCharCount() {
        const inputText = document.getElementById('inputText');
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
            
            // 确保进度条显示完成
            this.updateProgress(100, '处理完成！', '成功');
            
            // 稍等一下再显示结果，让用户看到完成状态
            setTimeout(() => {
                this.displayResult(functionType, result);
                this.hideLoading();
                this.showToast('✅ AI处理完成！', 'success');
            }, 800);
            
        } catch (error) {
            console.error('💥 Processing error:', error);
            
            // 显示错误进度
            this.updateProgress(0, '处理失败', '错误');
            
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
                console.log('🎉 Using AI result:', data.result.substring(0, 100));
                return data.result;
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
            console.log('✅ Output section shown');
        } else {
            console.error('❌ Output section elements not found!');
        }
    }

    hideOutput() {
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');
        
        outputPlaceholder.style.display = 'flex';
        outputContent.style.display = 'none';
    }

    showLoading() {
        console.log('⏳ Starting loading with progress bar...');
        
        const loadingElement = document.getElementById('loading');
        const outputTextElement = document.getElementById('outputText');
        
        loadingElement.style.display = 'flex';
        outputTextElement.style.display = 'none';
        
        // 重置进度条
        this.resetProgress();
        
        // 启动进度条动画
        this.startProgressAnimation();
    }

    hideLoading() {
        console.log('✅ Hiding loading...');
        
        const loadingElement = document.getElementById('loading');
        const outputTextElement = document.getElementById('outputText');
        
        // 停止进度动画
        this.stopProgressAnimation();
        
        loadingElement.style.display = 'none';
        outputTextElement.style.display = 'block';
    }

    resetProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        const progressStep = document.getElementById('progressStep');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (progressFill) progressFill.style.width = '0%';
        if (progressPercent) progressPercent.textContent = '0%';
        if (progressStep) progressStep.textContent = '初始化中';
        if (loadingMessage) loadingMessage.textContent = 'AI正在处理中...';
    }

    startProgressAnimation() {
        let progress = 0;
        let step = 0;
        
        const steps = [
            { progress: 15, message: '连接AI服务', step: '建立连接中' },
            { progress: 30, message: '分析文本内容', step: '语义分析中' },
            { progress: 50, message: '生成优化方案', step: 'AI思考中' },
            { progress: 75, message: '优化文案表达', step: '内容生成中' },
            { progress: 90, message: '完善输出格式', step: '结果整理中' }
        ];

        this.progressInterval = setInterval(() => {
            if (step < steps.length) {
                const currentStep = steps[step];
                progress = Math.min(progress + Math.random() * 3 + 1, currentStep.progress);
                
                this.updateProgress(Math.floor(progress), currentStep.message, currentStep.step);
                
                if (progress >= currentStep.progress) {
                    step++;
                }
            } else {
                // 最后阶段，缓慢增长到95%
                progress = Math.min(progress + Math.random() * 1, 95);
                this.updateProgress(Math.floor(progress), 'AI正在处理中...', '即将完成');
            }
        }, 200);
    }

    stopProgressAnimation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // 完成动画
        this.updateProgress(100, '处理完成！', '成功');
        
        setTimeout(() => {
            this.resetProgress();
        }, 500);
    }

    updateProgress(percent, message, step) {
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        const progressStep = document.getElementById('progressStep');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        if (progressPercent) {
            progressPercent.textContent = `${percent}%`;
        }
        if (progressStep) {
            progressStep.textContent = step;
        }
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
    }

    displayResult(functionType, result) {
        console.log('🎨 Displaying result:', { functionType, resultLength: result?.length });
        
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
        const outputText = document.getElementById('outputText');
        const copyBtn = document.getElementById('copyBtn');
        const useAsInputBtn = document.getElementById('useAsInputBtn');
        const editBtn = document.getElementById('editBtn');
        
        console.log('🔍 Output elements found:', {
            outputTitle: !!outputTitle,
            outputText: !!outputText,
            copyBtn: !!copyBtn,
            useAsInputBtn: !!useAsInputBtn,
            editBtn: !!editBtn
        });
        
        if (outputTitle && outputText) {
            outputTitle.textContent = functionTitles[functionType] || '处理结果';
            outputText.textContent = result;
            outputText.style.color = '#1d1d1f'; // 确保文字颜色正确
            
            // 重置编辑状态
            outputText.setAttribute('contenteditable', 'false');
            const editBtnText = document.getElementById('editBtnText');
            if (editBtnText) editBtnText.textContent = '编辑';
            
            // 显示所有操作按钮（使用CSS类确保立即生效）
            if (copyBtn) {
                copyBtn.style.opacity = '1';
                copyBtn.style.visibility = 'visible';
                copyBtn.classList.add('force-visible');
            }
            if (useAsInputBtn) {
                useAsInputBtn.style.opacity = '1';
                useAsInputBtn.style.visibility = 'visible';
                useAsInputBtn.classList.add('force-visible');
            }
            if (editBtn) {
                editBtn.style.opacity = '1';
                editBtn.style.visibility = 'visible';
                editBtn.classList.add('force-visible');
            }
            
            // 小延迟后移除强制类，让正常过渡生效
            setTimeout(() => {
                if (copyBtn) copyBtn.classList.remove('force-visible');
                if (useAsInputBtn) useAsInputBtn.classList.remove('force-visible');
                if (editBtn) editBtn.classList.remove('force-visible');
            }, 200);
            
            console.log('✅ Result displayed successfully');
        } else {
            console.error('❌ Output elements not found!');
        }
    }

    displayError(message) {
        document.getElementById('outputTitle').textContent = '处理失败';
        document.getElementById('outputText').textContent = message;
        document.getElementById('outputText').style.color = '#ff3b30';
        
        // 恢复默认颜色
        setTimeout(() => {
            document.getElementById('outputText').style.color = '#1d1d1f';
        }, 3000);
    }

    async copyOutput() {
        const outputText = document.getElementById('outputText').textContent;
        
        try {
            await navigator.clipboard.writeText(outputText);
            this.showToast('已复制到剪贴板');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = outputText;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast('已复制到剪贴板');
            } catch (err) {
                this.showToast('复制失败，请手动复制');
            }
            
            document.body.removeChild(textArea);
        }
    }

    useOutputAsInput() {
        const outputTextElement = document.getElementById('outputText');
        const inputTextArea = document.getElementById('inputText');
        
        // 获取输出文本内容（可能已经被用户编辑过）
        const outputText = outputTextElement.textContent || outputTextElement.innerText;
        
        inputTextArea.value = outputText;
        this.updateCharCount();
        this.hideOutput();
        
        // 聚焦到输入区域
        inputTextArea.focus();
        
        // 如果文本被编辑过，提示用户
        const isEdited = outputTextElement.getAttribute('contenteditable') === 'true';
        if (isEdited) {
            this.showToast('✅ 已将编辑后的内容设为新的输入文本');
        } else {
            this.showToast('已将结果设为新的输入文本');
        }
    }

    toggleEdit() {
        const outputText = document.getElementById('outputText');
        const editBtn = document.getElementById('editBtn');
        const editBtnText = document.getElementById('editBtnText');
        const copyBtn = document.getElementById('copyBtn');
        const useAsInputBtn = document.getElementById('useAsInputBtn');
        const isEditable = outputText.getAttribute('contenteditable') === 'true';
        
        if (isEditable) {
            // 切换到只读模式
            outputText.setAttribute('contenteditable', 'false');
            editBtnText.textContent = '编辑';
            this.showToast('✅ 编辑完成，已保存更改', 'success');
        } else {
            // 切换到编辑模式
            outputText.setAttribute('contenteditable', 'true');
            outputText.focus();
            editBtnText.textContent = '完成';
            this.showToast('✏️ 现在可以编辑输出内容', 'info');
        }
        
        // 强制重新设置所有按钮的可见状态，确保悬停效果正常
        if (copyBtn) {
            copyBtn.style.opacity = '1';
            copyBtn.style.visibility = 'visible';
            copyBtn.classList.add('force-visible');
        }
        if (useAsInputBtn) {
            useAsInputBtn.style.opacity = '1';
            useAsInputBtn.style.visibility = 'visible';
            useAsInputBtn.classList.add('force-visible');
        }
        if (editBtn) {
            editBtn.style.opacity = '1';
            editBtn.style.visibility = 'visible';
            editBtn.classList.add('force-visible');
        }
        
        // 移除强制类，让正常过渡生效
        setTimeout(() => {
            if (copyBtn) copyBtn.classList.remove('force-visible');
            if (useAsInputBtn) useAsInputBtn.classList.remove('force-visible');
            if (editBtn) editBtn.classList.remove('force-visible');
        }, 200);
    }

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
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#007aff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
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
