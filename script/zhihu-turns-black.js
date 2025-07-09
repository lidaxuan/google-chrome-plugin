// 暗黑模式切换器（不使用 GM 方法，适用于普通浏览器环境）
(function () {
  'use strict';

  // 注入样式（暗黑模式用）
  const darkStyle = document.createElement('style');
  darkStyle.textContent = `
    html.dark-mode {
      filter: invert(0.9) hue-rotate(180deg);
      background: #111 !important;
    }
    html.dark-mode img,
    html.dark-mode video {
      filter: invert(1) hue-rotate(180deg);
    }
  `;
  document.head.appendChild(darkStyle);

  // 创建切换按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '主题切换';
  Object.assign(toggleBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 99999,
    padding: '8px 12px',
    background: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  });

  toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
  });

  document.body.appendChild(toggleBtn);
})();