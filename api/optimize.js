const https = require('https');

// 后端服务配置
const BASE_URL = 'https://officeplus-ai-demo-c7e7ecehgtbbc8c6.eastus2-01.azurewebsites.net';

// 文本优化功能的提示词映射
const PROMPTS = {
    optimize: '请优化以下文案，使其更加清晰、简洁和有说服力：',
    expand: '请扩展以下文案，添加一些细节和内容：',
    summarize: '请简明扼要地表达以下内容：',
    simplify: '请简化以下文案表达方式，使其更容易理解：',
    emotional: '请为以下文案增加情感表达，使其更有感染力：',
    continue: '请续写以下文案：',
    check: '请检查以下文案是否有用词错误或表达不当的地方，提供修改后的版本：',
    translate: '请将以下文案翻译成指定语言：',
    custom: '请根据用户的自定义要求处理以下文案：'
};

// 调用 Azure OpenAI API
async function callAzureOpenAI(messages) {
    return new Promise((resolve, reject) => {
        const requestData = JSON.stringify({
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        const options = {
            method: 'POST',
            path: '/api/GPTChat/gpt-4o',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        const req = https.request(AZURE_OPENAI_ENDPOINT, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    if (data) {
                        resolve(data);
                    } else {
                        reject(new Error('Invalid response from Azure OpenAI'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(requestData);
        req.end();
    });
}

// 调用 Qwen API
async function callQwenAPI(messages) {
    return new Promise((resolve, reject) => {
        // 将消息数组转换为单个提示字符串
        const requestData = JSON.stringify(messages);

        const options = {
            method: 'POST',
            path: '/api/QwenChat/dmxapi',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            },
            rejectUnauthorized: false // Allow self-signed certificates
        };

        const req = https.request(BASE_URL, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    let responseText = data.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

                    if (responseText) {
                        resolve(responseText);
                    } else {
                        reject(new Error('Empty response from QwenChat API'));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse QwenChat response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`QwenChat API request failed: ${error.message}`));
        });

        req.write(requestData);
        req.end();
    });
}

module.exports = async (req, res) => {
    // 设置 CORS 头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 请求（预检请求）
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { text, type, customPrompt, targetLanguage } = req.body;
        
        let systemPrompt = PROMPTS[type] || PROMPTS.custom;
        let userMessage = text;
        
        // 处理特殊情况
        if (type === 'translate' && targetLanguage) {
            systemPrompt = `请将以下文案翻译成${targetLanguage}：`;
        } else if (type === 'custom' && customPrompt) {
            systemPrompt = customPrompt + '：';
        }

        const messages = [
            {
                role: 'system',
                content: '你是一个专业的文案优化助手，请根据用户的要求处理文案。'
            },
            {
                role: 'user',
                content: systemPrompt + '\n\n' + userMessage
            }
        ];

        const result = await callAzureOpenAI(messages);

        res.status(200).json({ success: true, result });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Processing failed: ' + error.message 
        });
    }
};
