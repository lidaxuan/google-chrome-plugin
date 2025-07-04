(function () {
    // window.String.prototype.a = function () {
    //     const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    //     return this.split("/").map((part, index) => index === 0 ? part : part.split("-").map(capitalize).join("")).join("");
    // };
    // content-script.js
    const script = document.createElement('script');
    script.textContent = `
  String.prototype.a = function () {
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    return this.split("/").map((part, index) => index === 0 ? part : part.split("-").map(capitalize).join("")).join("");
  };
  console.log("String.prototype.a 注入成功");
`;
    document.documentElement.appendChild(script);
    script.remove();

})();