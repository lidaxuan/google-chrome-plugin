(function () {

    function refreshCachedResources(urls) {
        return urls.map(url =>
            new Promise(function (resolve, reject) {
                const randomStr = Math.random().toString(36).substring(7);
                const urlWithParam = addQueryParameter(url, "_", randomStr);
                const tagName = url.endsWith(".css") ? "link" : "script";
                const newEl = createElement(tagName, urlWithParam, resolve, reject);
                const selector = url.endsWith(".css") ? `link[href="${url}"]` : `script[src="${url}"]`;
                replaceElement(selector, newEl);
            })
        );
    }

    function executePromisesSequentially(promises) {
        return promises.reduce(
            (chain, current) => chain.then(results => current.then(result => [...results, result])),
            Promise.resolve([])
        );
    }

    function addQueryParameter(url, key, value) {
        const sep = url.indexOf("?") === -1 ? "?" : "&";
        return url + sep + encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }

    function createElement(tag, url, onLoad, onError) {
        const el = document.createElement(tag);
        if (tag === "link") {
            el.setAttribute("rel", "stylesheet");
            el.setAttribute("href", url);
        } else {
            el.setAttribute("type", "text/javascript");
            el.setAttribute("src", url);
        }
        el.onload = onLoad;
        el.onerror = onError;
        return el;
    }

    function replaceElement(selector, newEl) {
        const oldEl = document.querySelector(selector);
        if (oldEl && oldEl.parentNode) {
            oldEl.parentNode.replaceChild(newEl, oldEl);
        }
    }

    function getAllResources() {
        return Array.from(document.querySelectorAll("link[href], script[src]")).map(el => el.tagName === "LINK" ? el.getAttribute("href") : el.getAttribute("src")).filter(url => /^(https?:)?\/\//.test(url));
    }

    executePromisesSequentially(
        refreshCachedResources(getAllResources())
    );

})();
