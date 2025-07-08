(function () {
    if (window.__LayoutInspectorActivated) return;
    window.__LayoutInspectorActivated = true;

    let locked = false;
    let gridVisible = false;
    let hintVisible = true;
    let gridSize = 8;
    let currentTarget = null;
    let collapsed = false;

    // 创建遮罩层及高亮盒子
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '999998',
    });
    document.body.appendChild(overlay);

    const box = document.createElement('div');
    Object.assign(box.style, {
        position: 'absolute',
        border: '2px dashed #e91e63',
        pointerEvents: 'none',
    });
    overlay.appendChild(box);

    const marginBox = document.createElement('div');
    Object.assign(marginBox.style, {
        position: 'absolute',
        background: 'rgba(233,30,99,0.15)',
        pointerEvents: 'none',
    });
    overlay.appendChild(marginBox);

    const paddingBox = document.createElement('div');
    Object.assign(paddingBox.style, {
        position: 'absolute',
        background: 'rgba(33,150,243,0.15)',
        pointerEvents: 'none',
    });
    overlay.appendChild(paddingBox);

    const reflowObserver = () => {
        if (locked && currentTarget) {
            const rect = currentTarget.getBoundingClientRect();
            updateInfo(currentTarget);
        }
    };
    window.addEventListener('scroll', reflowObserver, true);
    window.addEventListener('resize', reflowObserver, true);
    setInterval(reflowObserver, 300);

    const hintBox = document.createElement('div');
    hintBox.innerText = `[L] 锁定元素\n[G] 网格线开关\n[+/-] 网格缩放 (当前: ${gridSize}px)\n[H] 显隐快捷键\n[ESC] 退出`;
    Object.assign(hintBox.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        fontSize: '12px',
        padding: '6px 10px',
        borderRadius: '6px',
        zIndex: '9999999',
    });
    document.body.appendChild(hintBox);


    // 创建网格线层
    const gridLines = document.createElement('div');
    Object.assign(gridLines.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '999997',
        backgroundImage: `linear-gradient(rgba(0,0,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,255,0.1) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        display: 'none'
    });
    document.body.appendChild(gridLines);
    // 创建主面板
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        top: '40px',
        right: '40px',
        width: '380px',
        maxHeight: '600px',
        background: 'rgba(30, 30, 30, 0.95)',
        color: '#eee',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '13px',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.7)',
        padding: '16px',
        zIndex: '9999999',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        cursor: 'default'
    });

    const headerBox = document.createElement('div');
    Object.assign(headerBox.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
    });
    // 创建标题栏
    const header = document.createElement('div');
    Object.assign(header.style, {
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'move',
        userSelect: 'none'
    });
    header.textContent = '布局检测器 Layout Inspector';
    headerBox.appendChild(header);


    // 折叠按钮
    const toggleCollapseBtn = document.createElement('button');
    toggleCollapseBtn.textContent = '收起 ▲';
    toggleCollapseBtn.style.cssText = `background: transparent; border: none; color: #eee; font-weight: bold; cursor: pointer; font-size: 14px;`;
    headerBox.appendChild(toggleCollapseBtn);

    panel.appendChild(headerBox);
    document.body.appendChild(panel);

    // 拖拽实现
    (function enableDrag(elem) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        elem.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
            document.body.style.userSelect = '';
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;
            // 限制边界，防止拖出屏幕
            left = Math.min(Math.max(left, 10), window.innerWidth - panel.offsetWidth - 10);
            top = Math.min(Math.max(top, 10), window.innerHeight - panel.offsetHeight - 10);
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.position = 'fixed';
        });
    })(header);

    // 元素信息区
    const infoArea = document.createElement('pre');
    Object.assign(infoArea.style, {
        flexGrow: '1',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.3)',
        padding: '12px',
        borderRadius: '6px',
        whiteSpace: 'pre-wrap',
        marginBottom: '12px'
    });
    panel.appendChild(infoArea);


    // 按钮区
    const btnBar = document.createElement('div');
    Object.assign(btnBar.style, {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '12px'
    });
    panel.appendChild(btnBar);


    function createBtn(text, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            flex: '1 1 45%',
            padding: '8px 0',
            background: color || '#2196f3',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            marginRight: '10px',
            transition: 'background-color 0.3s'
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#1976d2';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = color || '#2196f3';
        });
        return btn;
    }

    const lockBtn = createBtn('🔒 锁定元素', '#e91e63');
    const toggleGridBtn = createBtn('网格线 (G)');
    const copyPathBtn = createBtn('复制路径');
    const exportStylesBtn = createBtn('导出样式 JSON');
    btnBar.appendChild(lockBtn);
    btnBar.appendChild(toggleGridBtn);
    btnBar.appendChild(copyPathBtn);
    btnBar.appendChild(exportStylesBtn);

    // 网格大小调节区域
    const gridControl = document.createElement('div');
    Object.assign(gridControl.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
    });
    panel.appendChild(gridControl);


    const gridLabel = document.createElement('span');
    gridLabel.textContent = `网格大小: ${gridSize}px`;
    gridLabel.style.flex = '1';
    gridControl.appendChild(gridLabel);

    const gridMinus = createBtn('-', '#f44336');
    gridMinus.style.flex = '0 0 40px';
    const gridPlus = createBtn('+', '#4caf50');
    gridPlus.style.flex = '0 0 40px';
    gridControl.appendChild(gridMinus);
    gridControl.appendChild(gridPlus);

    // 盒模型编辑区
    const boxModelSection = document.createElement('div');
    boxModelSection.style.borderTop = '1px solid #555';
    boxModelSection.style.paddingTop = '10px';
    panel.appendChild(boxModelSection);

    const boxModelTitle = document.createElement('div');
    boxModelTitle.textContent = '盒模型编辑 (px)';
    boxModelTitle.style.fontWeight = '600';
    boxModelTitle.style.marginBottom = '6px';
    boxModelSection.appendChild(boxModelTitle);

    const boxModelGrid = document.createElement('div');
    boxModelGrid.style.display = 'grid';
    boxModelGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    boxModelGrid.style.gap = '8px 12px';
    boxModelSection.appendChild(boxModelGrid);

    const boxModelFields = [
        'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
    ];

    const boxModelLabels = [
        'Margin Top', 'Margin Right', 'Margin Bottom', 'Margin Left',
        'Padding Top', 'Padding Right', 'Padding Bottom', 'Padding Left'
    ];

    const inputs = {};

    boxModelFields.forEach((field, i) => {
        const label = document.createElement('label');
        Object.assign(label.style, {
            display: 'flex',
            flexDirection: 'column',
            fontSize: '11px',
            color: '#ccc'
        });
        label.textContent = boxModelLabels[i];

        const input = document.createElement('input');
        input.type = 'number';
        Object.assign(input.style, {
            marginTop: '4px',
            padding: '4px 6px',
            borderRadius: '4px',
            border: 'none',
            background: '#222',
            color: '#eee',
            fontSize: '13px'
        });


        label.appendChild(input);
        boxModelGrid.appendChild(label);
        inputs[field] = input;

        input.addEventListener('input', () => {
            if (!currentTarget) return;
            const val = input.value;
            if (val === '' || isNaN(val)) {
                currentTarget.style[field] = '';
            } else {
                currentTarget.style[field] = val + 'px';
            }
            updateInfo(currentTarget);
        });
    });

    // 盒模型重置按钮
    const resetBtn = createBtn('重置盒模型', '#9e9e9e');
    resetBtn.style.marginTop = '10px';
    resetBtn.style.flex = 'none';
    boxModelSection.appendChild(resetBtn);

    resetBtn.addEventListener('click', () => {
        if (!currentTarget) return;
        boxModelFields.forEach(f => currentTarget.style[f] = '');
        updateInfo(currentTarget);
    });

    // 复制路径功能
    function getCssPath(el) {
        if (!(el instanceof Element)) return '';
        const path = [];
        while (el) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += `#${el.id}`;
                path.unshift(selector);
                break;
            } else {
                if (el.className && typeof el.className === 'string') {
                    const classes = el.className.trim().split(/\s+/).join('.');
                    if (classes) selector += `.${classes}`;
                }
                const parent = el.parentNode;
                if (parent) {
                    const siblings = Array.from(parent.children).filter(child => child.nodeName === el.nodeName);
                    if (siblings.length > 1) {
                        const index = siblings.indexOf(el) + 1;
                        selector += `:nth-of-type(${index})`;
                    }
                }
                path.unshift(selector);
                el = parent;
            }
        }
        return path.join(' > ');
    }

    copyPathBtn.addEventListener('click', () => {
        if (!currentTarget) return alert('无选中元素');
        const path = getCssPath(currentTarget);
        navigator.clipboard.writeText(path).then(() => {
            alert('已复制元素路径:\n' + path);
        });
    });

    // 获取用户自定义样式（排除浏览器默认样式）
    function getUserDefinedStyles(el) {
        const styles = window.getComputedStyle(el);
        const defaultEl = document.createElement(el.tagName);
        document.body.appendChild(defaultEl);
        const defaultStyles = window.getComputedStyle(defaultEl);
        const diff = [];
        for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            const val = styles.getPropertyValue(prop);
            const defVal = defaultStyles.getPropertyValue(prop);
            if (val !== defVal) {
                diff.push(`${prop}: ${val}`);
            }
        }
        defaultEl.remove();
        return diff.join('; \n');
    }

    exportStylesBtn.addEventListener('click', () => {
        if (!currentTarget) return alert('无选中元素');
        const stylesStr = getUserDefinedStyles(currentTarget);
        const stylesArr = stylesStr.split(';').map(s => s.trim()).filter(Boolean);
        const styleObj = {};
        stylesArr.forEach(item => {
            const [k, v] = item.split(':').map(s => s.trim());
            if (k && v) styleObj[k] = v;
        });
        const jsonStr = JSON.stringify(styleObj, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert('已复制样式 JSON:\n' + jsonStr);
        });
    });

    // 更新信息面板
    function updateInfo(target) {
        if (!target) {
            infoArea.textContent = '无选中元素';
            return;
        }
        currentTarget = target;
        const rect = target.getBoundingClientRect();
        const style = window.getComputedStyle(target);

        const marginTop = parseFloat(style.marginTop) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const marginLeft = parseFloat(style.marginLeft) || 0;

        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;
        const paddingLeft = parseFloat(style.paddingLeft) || 0;

        // 画盒模型高亮
        box.style.left = rect.left + 'px';
        box.style.top = rect.top + 'px';
        box.style.width = rect.width + 'px';
        box.style.height = rect.height + 'px';

        marginBox.style.left = (rect.left - marginLeft) + 'px';
        marginBox.style.top = (rect.top - marginTop) + 'px';
        marginBox.style.width = (rect.width + marginLeft + marginRight) + 'px';
        marginBox.style.height = (rect.height + marginTop + marginBottom) + 'px';

        paddingBox.style.left = (rect.left + paddingLeft) + 'px';
        paddingBox.style.top = (rect.top + paddingTop) + 'px';
        paddingBox.style.width = (rect.width - paddingLeft - paddingRight) + 'px';
        paddingBox.style.height = (rect.height - paddingTop - paddingBottom) + 'px';

        // 信息文本
        const tag = target.tagName.toLowerCase();
        const id = target.id ? `#${target.id}` : '';
        const classes = target.className && typeof target.className === 'string' ? '.' + target.className.trim().split(/\s+/).join('.') : '';
        const size = `尺寸: ${Math.round(rect.width)} x ${Math.round(rect.height)}`;
        const inlineStyle = target.getAttribute('style') || '无';

        const userStyles = getUserDefinedStyles(target);

        infoArea.textContent =
            `${tag}${id}${classes}\n${size}\n\n` +
            `ID: ${target.id || '无'}\n\n` +
            `Class: ${target.className || '无'}\n\n` +
            `Margin: ${style.margin}\nPadding: ${style.padding}\n\n` +
            `Inline Style: ${inlineStyle}\n\n` +
            `用户自定义样式:\n${userStyles || '无'}\n\n`;


        // 同步盒模型输入框数值
        inputs.marginTop.value = marginTop;
        inputs.marginRight.value = marginRight;
        inputs.marginBottom.value = marginBottom;
        inputs.marginLeft.value = marginLeft;
        inputs.paddingTop.value = paddingTop;
        inputs.paddingRight.value = paddingRight;
        inputs.paddingBottom.value = paddingBottom;
        inputs.paddingLeft.value = paddingLeft;
    }

    // 鼠标移动监听
    document.addEventListener('mousemove', e => {
        if (locked || collapsed) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el === panel || panel.contains(el)) return;
        updateInfo(el);
    });

    // 按钮事件
    lockBtn.addEventListener('click', () => {
        locked = !locked;
        lockBtn.textContent = locked ? '🔓 解除锁定' : '🔒 锁定元素';
    });

    toggleGridBtn.addEventListener('click', () => {
        gridVisible = !gridVisible;
        gridLines.style.display = gridVisible ? 'block' : 'none';
        toggleGridBtn.textContent = gridVisible ? '网格线(开启)' : '网格线(关闭)';
    });

    gridMinus.addEventListener('click', () => {
        gridSize = Math.max(2, gridSize - 2);
        gridLines.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        gridLabel.textContent = `网格大小: ${gridSize}px`;
    });

    gridPlus.addEventListener('click', () => {
        gridSize = Math.min(100, gridSize + 2);
        gridLines.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        gridLabel.textContent = `网格大小: ${gridSize}px`;
    });

    toggleCollapseBtn.addEventListener('click', () => {
        collapsed = !collapsed;
        if (collapsed) {
            // 折叠时隐藏除标题栏和折叠按钮外所有内容
            // Array.from(panel.children).forEach(child => {
            //     if (child !== headerBox) {
            //         // child.style.display = 'none';
            //     }
            // });
            toggleCollapseBtn.textContent = '展开 ▼';
            panel.style.height = '51px';
            panel.style.overflow = 'hidden';
            // panel.style.width = '300px';
            // 防止鼠标移动触发元素切换，锁定当前元素
            locked = true;
            lockBtn.textContent = '🔓 解除锁定';
        } else {
            // 展开恢复显示
            // Array.from(panel.children).forEach(child => {
            //     if (child == headerBox) {
            //         child.style.display = 'flex';
            //     } else {
            //         child.style.display = '';
            //     }
            // });
            toggleCollapseBtn.textContent = '收起 ▲';
            panel.style.height = 'auto';
            // panel.style.width = '380px';
            locked = false;
            lockBtn.textContent = '🔒 锁定元素';
        }
    });

    // 退出快捷键监听 (ESC)
    document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();

        if (key === 'escape') {
            hintBox.remove();
            overlay.remove();
            panel.remove();
            gridLines.remove();
            window.__LayoutInspectorActivated = false;
            console.log('%c[Layout Inspector] 已退出', 'color: orange');
        } else if (key === 'g') {
            gridVisible = !gridVisible;
            gridLines.style.display = gridVisible ? 'block' : 'none';
            toggleGridBtn.textContent = gridVisible ? '网格线(开启)' : '网格线(关闭)';
        } else if (key.toLowerCase() === 'h') {
            hintVisible = !hintVisible;
            hintBox.style.display = hintVisible ? 'block' : 'none';
            console.log(`[Layout Inspector] 快捷键提示 ${hintVisible ? '显示' : '隐藏'}`);
        } else if (key === 'l') {
            locked = !locked;
            lockBtn.textContent = locked ? '🔓 解除锁定' : '🔒 锁定元素';
        } else if (key === '+' || key === '=' || (e.shiftKey && key === '=')) {
            gridSize = Math.min(100, gridSize + 2);
            gridLines.style.backgroundSize = `${gridSize}px ${gridSize}px`;
            gridLabel.textContent = `网格大小: ${gridSize}px`;
        } else if (key === '-') {
            gridSize = Math.max(2, gridSize - 2);
            gridLines.style.backgroundSize = `${gridSize}px ${gridSize}px`;
            gridLabel.textContent = `网格大小: ${gridSize}px`;
        }
    });

    console.log('%c[Layout Inspector] 漂亮UI面板版带折叠功能运行中，ESC退出', 'color: #4caf50');
})();

