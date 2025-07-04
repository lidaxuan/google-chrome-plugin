(async function () {
    const pipContent = document.body;
    const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 200, height: 300 });
    pipWindow.document.body.appendChild(pipContent.cloneNode(true));
    [...document.styleSheets].forEach((styleSheet) => {
        try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.media = styleSheet.media;
            link.href = styleSheet.href ?? "";
            pipWindow.document.head.appendChild(link);
        }
    });
    pipWindow.addEventListener("pagehide", (event) => {
        console.log("已退出 PIP 窗口");
    });
    pipWindow.addEventListener("focus", () => {
        console.log("PiP 窗口进入了焦点状态");
    });
    pipWindow.addEventListener("blur", () => {
        console.log("PiP 窗口失去了焦点");
    });
})();