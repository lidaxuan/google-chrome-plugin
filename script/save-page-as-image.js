(function () {
    function l(s, c) {
        const d = document.createElement('script');
        d.src = s;
        d.onload = c;
        document.body.appendChild(d);
    }

    function r() {
        html2canvas(document.body, { useCORS: true, backgroundColor: null, scale: 2 }).then(c => {
            const a = document.createElement('a');
            a.download = 'screenshot.png';
            a.href = c.toDataURL('image/png');
            a.click();
        });
    }

    if (typeof html2canvas !== 'undefined') {
        r();
    } else {
        l('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', r);
    }
})();