// === 单次右键复制功能 + 鼠标选中复制增强 ===
(function () {
  if (window.__copyListenerActive) return;
  window.__copyListenerActive = true;

  const showNotice = (msg, timeout = 1500) => {
    const notice = document.createElement('div');
    notice.textContent = msg;
    Object.assign(notice.style, {
      position: 'fixed',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#333',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      zIndex: '999999',
      fontSize: '14px',
      pointerEvents: 'none'
    });
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), timeout);
  };

  const contextHandler = (e) => {
    e.preventDefault();
    const target = e.target.closest('[data-copy]') || e.target;
    const text = target.getAttribute('data-copy') || target.innerText || target.textContent || '';
    const cleanText = text.trim();

    if (cleanText) {
      navigator.clipboard.writeText(cleanText).then(() => {
        showNotice('已复制: ' + cleanText.slice(0, 50));
      });
    } else {
      showNotice('未找到可复制内容');
    }

    document.removeEventListener('contextmenu', contextHandler, true);
    window.__copyListenerActive = false;
  };

  const selectionHandler = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText).then(() => {
        showNotice('选中内容已复制: ' + selectedText.slice(0, 50));
      });
    }
    document.removeEventListener('mouseup', selectionHandler, true);
  };

  // 注册右键复制和鼠标抬起复制监听
  document.addEventListener('contextmenu', contextHandler, true);
  document.addEventListener('mouseup', selectionHandler, true);
})();