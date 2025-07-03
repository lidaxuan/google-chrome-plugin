(function(bookmarklets) {
  for (var i = 0; i < bookmarklets.length; i++) {
    var code = bookmarklets[i].url;
    if (code.indexOf("javascript:") !== -1) {
      code = code.replace("javascript:", "");
      eval(code); // 执行 bookmarklet 脚本
    } else {
      code = code.replace(/^\s+|\s+$/g, ""); // 去除前后空格
      if (code.length > 0) {
        window.open(code);
      }
    }
  }
})([
  {
    title: "破除右键菜单限制",
    url: "javascript:function applyWin(a){if(typeof a.__nnANTImm__===\"undefined\"){a.__nnANTImm__={};a.__nnANTImm__.evts=[\"mousedown\",\"mousemove\",\"copy\",\"contextmenu\"];a.__nnANTImm__.initANTI=function(){a.__nnantiflag__=true;a.__nnANTImm__.evts.forEach(function(c,b,d){a.addEventListener(c,this.fnANTI,true)},a.__nnANTImm__)};a.__nnANTImm__.clearANTI=function(){delete a.__nnantiflag__;a.__nnANTImm__.evts.forEach(function(c,b,d){a.removeEventListener(c,this.fnANTI,true)},a.__nnANTImm__);delete a.__nnANTImm__};a.__nnANTImm__.fnANTI=function(b){b.stopPropagation();return true};a.addEventListener(\"unload\",function(b){a.removeEventListener(\"unload\",arguments.callee,false);if(a.__nnantiflag__===true){a.__nnANTImm__.clearANTI()}},false)}a.__nnantiflag__===true?a.__nnANTImm__.clearANTI():a.__nnANTImm__.initANTI()}applyWin(top);var fs=top.document.querySelectorAll(\"frame, iframe\");for(var i=0,len=fs.length;i<len;i++){var win=fs[i].contentWindow;try{win.document}catch(ex){continue}applyWin(fs[i].contentWindow)};void 0;"
  },
  {
    title: "破除选择复制限制",
    url: "javascript:(function(){var doc=document;var bd=doc.body;bd.onselectstart=bd.oncopy=bd.onpaste=bd.onkeydown=bd.oncontextmenu=bd.onmousemove=bd.onselectstart=bd.ondragstart=doc.onselectstart=doc.oncopy=doc.onpaste=doc.onkeydown=doc.oncontextmenu=null;doc.onselectstart=doc.oncontextmenu=doc.onmousedown=doc.onkeydown=function (){return true;};with(document.wrappedJSObject||document){onmouseup=null;onmousedown=null;oncontextmenu=null;}var arAllElements=document.getElementsByTagName('*');for(var i=arAllElements.length-1;i>=0;i--){var elmOne=arAllElements[i];with(elmOne.wrappedJSObject||elmOne){onmouseup=null;onmousedown=null;}}var head=document.getElementsByTagName('head')[0];if(head){var style=document.createElement('style');style.type='text/css';style.innerHTML=\"html,*{-moz-user-select:auto!important;}\";head.appendChild(style);}void(0);})();"
  }
]);
