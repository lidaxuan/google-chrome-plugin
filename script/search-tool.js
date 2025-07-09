// === 自定义页面搜索工具 ===

let highlights = [];
let currentIndex = -1;
let searchWrapper = null;
let caseSensitive = false;
let wholeMatch = false;

(function showSearchBox() {
  if (document.getElementById('gu-search-box')) return;

  searchWrapper = document.createElement('div');
  searchWrapper.innerHTML = `
    <div id="gu-search-box" style="
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 1px solid #aaa;
      border-radius: 6px;
      padding: 6px;
      z-index: 999999;
      display: flex;
      gap: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: sans-serif;
      align-items: center;
    ">
      <input type="text" id="gu-search-input" placeholder="搜索..." style="width:200px;padding:4px;" />
      <span id="gu-search-count" style="margin-left:4px;color:#555;font-size:12px;"></span>
      <label><input type="checkbox" id="gu-case-toggle"> 区分大小写</label>
      <label><input type="checkbox" id="gu-whole-toggle"> 全词匹配</label>
      <button id="gu-prev-btn">↑</button>
      <button id="gu-next-btn">↓</button>
      <button id="gu-del-btn">删除</button>
      <button id="gu-close-btn">×</button>
    </div>
  `;
  document.body.appendChild(searchWrapper);

  const input = document.getElementById('gu-search-input');
  input.focus();

  input.addEventListener('input', () => {
    refreshHighlights();
  });

  document.getElementById('gu-prev-btn').onclick = () => { scrollToMatch(-1); updateCount(); };
  document.getElementById('gu-next-btn').onclick = () => { scrollToMatch(1); updateCount(); };
  document.getElementById('gu-del-btn').onclick = () => { clearHighlights(); updateCount(); };
  document.getElementById('gu-close-btn').onclick = removeSearchBox;
  document.getElementById('gu-case-toggle').onchange = () => refreshHighlights();
  document.getElementById('gu-whole-toggle').onchange = () => refreshHighlights();

  document.addEventListener('keydown', onSearchKeydown);
})();

function onSearchKeydown(e) {
  if (e.key === 'Escape') removeSearchBox();
  if (e.key === 'Enter' && document.activeElement.id === 'gu-search-input') {
    scrollToMatch(1);
    updateCount();
  }
}

function removeSearchBox() {
  if (searchWrapper) searchWrapper.remove();
  searchWrapper = null;
  clearHighlights();
  document.removeEventListener('keydown', onSearchKeydown);
}

function clearHighlights() {
  highlights.forEach(span => {
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize();
  });
  highlights = [];
  currentIndex = -1;
}

function refreshHighlights() {
  clearHighlights();
  const keyword = document.getElementById('gu-search-input').value.trim();
  caseSensitive = document.getElementById('gu-case-toggle').checked;
  wholeMatch = document.getElementById('gu-whole-toggle').checked;
  if (keyword) highlightMatches(keyword);
  currentIndex = -1;
  updateCount();
}

function highlightMatches(keyword) {
  let flags = caseSensitive ? 'g' : 'gi';
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = wholeMatch ? `\\b${escapedKeyword}\\b` : escapedKeyword;
  const regex = new RegExp(pattern, flags);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.parentElement || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(node.parentElement.tagName)) {
        return NodeFilter.FILTER_SKIP;
      }
      return regex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;

    node.nodeValue.replace(regex, (match, index) => {
      const before = node.nodeValue.slice(lastIndex, index);
      const highlight = document.createElement('span');
      highlight.textContent = match;
      highlight.style.backgroundColor = 'yellow';
      highlight.className = 'gu-highlight';

      frag.appendChild(document.createTextNode(before));
      frag.appendChild(highlight);

      highlights.push(highlight);
      lastIndex = index + match.length;
    });

    frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
    node.parentNode.replaceChild(frag, node);
  }
}

function scrollToMatch(direction) {
  if (!highlights.length) return;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = highlights.length - 1;
  if (currentIndex >= highlights.length) currentIndex = 0;

  highlights.forEach(el => el.style.outline = '');
  const target = highlights[currentIndex];
  target.style.outline = '2px solid red';
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function updateCount() {
  const countEl = document.getElementById('gu-search-count');
  if (!countEl) return;
  if (highlights.length === 0) {
    countEl.textContent = '';
  } else {
    countEl.textContent = `${(currentIndex + 1 || 1)} / ${highlights.length}`;
  }
}
