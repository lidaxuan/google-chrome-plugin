function injectScript(file) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [file]
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const toast = document.createElement('div');
          toast.innerText = '✅ 脚本已执行';
          Object.assign(toast.style, {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#323232',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 9999999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'opacity 0.5s ease',
            opacity: '1'
          });
          document.body.appendChild(toast);

          setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
          }, 2000);
        }
      });
    });
  });
}

document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('click', () => {
    const file = btn.dataset.script;
    injectScript(file);
  });
});
