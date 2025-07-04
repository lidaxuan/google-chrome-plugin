(function () {
    String.prototype.a = function () {
        const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
        return this.split("/").map((part, index) => index === 0 ? part : part.split("-").map(capitalize).join("")).join("");
    };
})();