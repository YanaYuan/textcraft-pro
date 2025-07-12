// 测试API的JavaScript文件
const testAPI = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                text: '这是一个测试文本，用来验证AI功能是否正常工作。',
                type: 'optimize'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API测试结果:', data);
        
        if (data.success) {
            console.log('✅ API工作正常');
            console.log('AI结果:', data.result);
        } else {
            console.log('❌ API返回错误:', data.error);
        }
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
};

testAPI();
