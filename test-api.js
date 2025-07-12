// 测试API功能的简单脚本
async function testAPI() {
    try {
        const response = await fetch('http://localhost:8000/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: "这是一个测试文本，用来验证API是否正常工作。",
                type: "optimize"
            })
        });

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
            console.log('✅ API working correctly!');
            console.log('Result:', data.result);
        } else {
            console.log('❌ API error:', data.error);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testAPI };
}
