// 全局变量
let usedIndices = new Set(); // 用于记录已使用的索引
let currentIndex = null; // 当前显示的卡片索引

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载时显示第一个随机卡片
    generateRandomCard();
    
    // 绑定随机生成按钮事件
    document.getElementById('random-btn').addEventListener('click', generateRandomCard);
});

// 生成随机卡片
function generateRandomCard() {
    const cardContainer = document.getElementById('card-container');
    
    // 如果所有数据都已显示过，重置记录
    if (usedIndices.size >= chemicalData.length) {
        usedIndices.clear();
    }
    
    // 随机选择一个未使用的索引
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * chemicalData.length);
    } while (usedIndices.has(randomIndex));
    
    // 记录已使用的索引
    usedIndices.add(randomIndex);
    currentIndex = randomIndex;
    
    // 获取随机数据
    const chemical = chemicalData[randomIndex];
    
    // 创建卡片HTML
    const cardHTML = createCardHTML(chemical);
    
    // 添加淡入动画效果
    cardContainer.style.opacity = '0';
    
    setTimeout(() => {
        cardContainer.innerHTML = cardHTML;
        cardContainer.style.opacity = '1';
    }, 150);
}

// 创建卡片HTML
function createCardHTML(chemical) {
    const isElement = chemical.type === "单质";
    
    // 基本信息
    let detailsHTML = '';
    if (isElement) {
        detailsHTML = `
            <div class="detail-item">
                <div class="detail-label">原子序数</div>
                <div class="detail-value">${chemical.atomicNumber}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">原子量</div>
                <div class="detail-value">${chemical.atomicWeight}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">类别</div>
                <div class="detail-value">${chemical.category}</div>
            </div>
        `;
    } else {
        detailsHTML = `
            <div class="detail-item">
                <div class="detail-label">分子式</div>
                <div class="detail-value">${chemical.formula}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">分子量</div>
                <div class="detail-value">${chemical.molecularWeight}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">类别</div>
                <div class="detail-value">${chemical.category}</div>
            </div>
        `;
    }

    // 物理性质
    const physicalProps = `
        <div class="physical-props">
            <div class="physical-prop">
                <div class="prop-label">相态</div>
                <div class="prop-value">${chemical.phase}</div>
            </div>
            <div class="physical-prop">
                <div class="prop-label">颜色</div>
                <div class="prop-value">${chemical.color}</div>
            </div>
            <div class="physical-prop">
                <div class="prop-label">酸碱性</div>
                <div class="prop-value">${chemical.acidBase}</div>
            </div>
        </div>
    `;

    // 扩展信息
    const extendedInfo = chemical.funFacts ? `
        <div class="extended-info">
            ${chemical.discovery ? `
                <div class="info-section">
                    <div class="info-title">发现历史</div>
                    <div class="info-content">${chemical.discovery}</div>
                </div>
            ` : ''}
            
            ${chemical.origin ? `
                <div class="info-section">
                    <div class="info-title">来源产地</div>
                    <div class="info-content">${chemical.origin}</div>
                </div>
            ` : ''}
            
            ${chemical.history ? `
                <div class="info-section">
                    <div class="info-title">历史背景</div>
                    <div class="info-content">${chemical.history}</div>
                </div>
            ` : ''}
            
            ${chemical.funFacts ? `
                <div class="info-section">
                    <div class="info-title">有趣事实</div>
                    <ul class="fun-facts">
                        ${chemical.funFacts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    ` : '';
    
    return `
        <div class="card">
            ${isElement ? `<div class="atomic-number">${chemical.atomicNumber}</div>` : ''}
            <div class="symbol">${chemical.symbol}</div>
            <div class="english-name">${chemical.englishName}</div>
            <div class="chinese-name">${chemical.chineseName}</div>
            <div class="type ${chemical.type}">${chemical.type}</div>
            
            <div class="details">
                ${detailsHTML}
            </div>
            
            ${physicalProps}
            
            <div class="description">${chemical.description}</div>
            
            ${extendedInfo}
        </div>
    `;
}

// 键盘快捷键支持
document.addEventListener('keydown', function(event) {
    // 按空格键或回车键也可以随机生成
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        generateRandomCard();
    }
    
    // 按R键也可以随机生成
    if (event.code === 'KeyR') {
        generateRandomCard();
    }
});

// 触摸手势支持（移动设备）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 左右滑动切换卡片
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        generateRandomCard();
    }
});

// 添加一些动画效果
function addCardAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 页面加载完成后添加动画
setTimeout(addCardAnimations, 500);

// 添加统计信息显示
function showStats() {
    const totalCards = chemicalData.length;
    const viewedCards = usedIndices.size;
    const percentage = Math.round((viewedCards / totalCards) * 100);
    
    console.log(`已查看 ${viewedCards}/${totalCards} (${percentage}%)`);
}

// 每次生成新卡片时更新统计
const originalGenerateRandomCard = generateRandomCard;
generateRandomCard = function() {
    originalGenerateRandomCard();
    setTimeout(showStats, 100);
};