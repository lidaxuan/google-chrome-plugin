function injectScript(file) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [file]
    });
  });
}

document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('click', () => {
    const file = btn.dataset.script;
    injectScript(file);
  });
});
