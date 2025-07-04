(function () {
    var nw = window.open("about:blank", "临时编辑页");
    nw.document.title = "临时编辑页";
    nw.document.body.contentEditable = true;
    nw.document.body.innerText = " ";
})()