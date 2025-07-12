// 直接测试主页面功能的脚本
console.log('🧪 开始主页面功能测试...');

// 测试1：检查元素是否存在
function checkElements() {
    const elements = {
        inputText: document.getElementById('inputText'),
        optimizeBtn: document.querySelector('[data-function="optimize"]'),
        outputPlaceholder: document.getElementById('outputPlaceholder'),
        outputContent: document.getElementById('outputContent'),
        outputTitle: document.getElementById('outputTitle'),
        outputText: document.getElementById('outputText')
    };
    
    console.log('🔍 页面元素检查:', elements);
    
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`❌ 元素缺失: ${name}`);
            return false;
        }
    }
    
    console.log('✅ 所有元素都存在');
    return true;
}

// 测试2：模拟点击事件
function simulateClick() {
    console.log('🖱️ 模拟点击测试...');
    
    // 设置输入文本
    const inputText = document.getElementById('inputText');
    inputText.value = '测试文本';
    
    // 触发字符计数更新
    if (window.textOptimizer) {
        window.textOptimizer.updateCharCount();
    }
    
    // 模拟点击优化按钮
    const optimizeBtn = document.querySelector('[data-function="optimize"]');
    if (optimizeBtn) {
        console.log('🎯 触发优化按钮点击事件');
        optimizeBtn.click();
    } else {
        console.error('❌ 优化按钮未找到');
    }
}

// 测试3：直接调用API
async function directAPICall() {
    console.log('🚀 直接API调用测试...');
    
    try {
        const response = await fetch('/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                text: '测试直接API调用',
                type: 'optimize'
            })
        });
        
        const data = await response.json();
        console.log('📥 API响应:', data);
        
        if (data.success) {
            // 手动显示结果
            document.getElementById('outputPlaceholder').style.display = 'none';
            document.getElementById('outputContent').style.display = 'flex';
            document.getElementById('outputTitle').textContent = '直接API调用结果';
            document.getElementById('outputText').textContent = data.result;
            console.log('✅ 结果已手动显示');
        }
        
    } catch (error) {
        console.error('❌ API调用失败:', error);
    }
}

// 运行测试
setTimeout(() => {
    if (checkElements()) {
        console.log('🎮 所有测试函数已准备就绪:');
        console.log('- checkElements() - 检查页面元素');
        console.log('- simulateClick() - 模拟按钮点击');
        console.log('- directAPICall() - 直接API调用');
        console.log('');
        console.log('💡 在控制台运行 simulateClick() 或 directAPICall() 来测试功能');
    }
}, 1000);

// 导出到全局
window.testFunctions = {
    checkElements,
    simulateClick,
    directAPICall
};
