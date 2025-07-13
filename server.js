const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Azure OpenAI 配置
const AZURE_OPENAI_ENDPOINT = 'https://hanc04-openai-sweden-central.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview';
const AZURE_OPENAI_KEY = 'af60f8ec72694fc8bbb785f492ae9a02';

// 文本优化功能的提示词映射
const PROMPTS = {
    optimize: '请优化以下文案，使其更加清晰、简洁和有说服力：',
    expand: '请扩展以下文案，添加一些细节和内容：',
    summarize: '请简明扼要地表达以下内容：',
    simplify: '请简化以下文案表达方式，使其更容易理解：',
    emotional: '请让以下文案表达更具体，添加具体的细节、数据、例子或说明：',
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
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_OPENAI_KEY,
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
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0]) {
                        resolve(response.choices[0].message.content);
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

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // 设置 CORS 头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 请求（预检请求）
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 处理 API 请求
    if (req.method === 'POST' && parsedUrl.pathname === '/api/optimize') {
        console.log('API request received');
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                console.log('Request body:', body);
                const { text, type, customPrompt, targetLanguage } = JSON.parse(body);
                console.log('Parsed request:', { text, type, customPrompt, targetLanguage });
                
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

                console.log('Calling Azure OpenAI with messages:', messages);
                const result = await callAzureOpenAI(messages);
                console.log('Azure OpenAI result:', result);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, result }));
                
            } catch (error) {
                console.error('API Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Processing failed: ' + error.message 
                }));
            }
        });
        return;
    }

    // 处理静态文件
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // 移除查询参数（如 ?v=4）
    filePath = filePath.split('?')[0];
    
    filePath = path.join(__dirname, filePath);
    
    console.log('📁 Serving static file:', filePath);
    
    // 获取文件扩展名
    const extname = path.extname(filePath);
    
    // 设置Content-Type
    let contentType = 'text/html';
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
