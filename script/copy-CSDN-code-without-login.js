(function () {
    $('#content_views').unbind('copy');
      csdn.copyright.textData = '';
      document.querySelectorAll(".prism,.hljs-button").forEach((b) => {
        b.setAttribute('data-title', '\u590d\u5236');
        b.onclick = function (e) {
          navigator.clipboard.writeText(e.target.parentElement.innerText);
          e.stopPropagation();
          e.target.setAttribute('data-title', '\u590d\u5236\u6210\u529f');
          setTimeout(() => {
            e.target.setAttribute('data-title', '\u590d\u5236');
          }, 2000)
        }
      });
      document.querySelectorAll("style").forEach((s) => {
        if ((s.innerText || "").indexOf('#content_views pre') > -1) {
          s.parentElement.removeChild(s)
        }
      });
})()