chrome.scripting.executeScript({
  target: { tabId: YOUR_TAB_ID }, // 你要注入的标签页
  func: function () {
    function applyWin(a) {
      if (typeof a.__nnANTImm__ === "undefined") {
        a.__nnANTImm__ = {};
        a.__nnANTImm__.evts = ["mousedown", "mousemove", "copy", "contextmenu"];
        a.__nnANTImm__.initANTI = function () {
          a.__nnantiflag__ = true;
          a.__nnANTImm__.evts.forEach(function (c, b, d) {
            a.addEventListener(c, this.fnANTI, true);
          }, a.__nnANTImm__);
        };
        a.__nnANTImm__.clearANTI = function () {
          delete a.__nnantiflag__;
          a.__nnANTImm__.evts.forEach(function (c, b, d) {
            a.removeEventListener(c, this.fnANTI, true);
          }, a.__nnANTImm__);
          delete a.__nnANTImm__;
        };
        a.__nnANTImm__.fnANTI = function (b) {
          b.stopPropagation();
          return true;
        };
        a.addEventListener("unload", function (b) {
          a.removeEventListener("unload", arguments.callee, false);
          if (a.__nnantiflag__ === true) {
            a.__nnANTImm__.clearANTI();
          }
        }, false);
      }
      a.__nnantiflag__ === true ? a.__nnANTImm__.clearANTI() : a.__nnANTImm__.initANTI();
    }

    applyWin(top);
    var fs = top.document.querySelectorAll("frame, iframe");
    for (var i = 0, len = fs.length; i < len; i++) {
      var win = fs[i].contentWindow;
      try {
        win.document;
      } catch (ex) {
        continue;
      }
      applyWin(fs[i].contentWindow);
    }
  }
});
