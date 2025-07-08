(function () {
  console.log(123, window);

  // window.a = function () {
  //     const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  //     return this.split("/").map((part, index) => index === 0 ? part : part.split("-").map(capitalize).join("")).join("");
  // };
  function injectToPage(func) {
    const script = document.createElement('script');
    script.textContent = `(${func})();`;
    document.documentElement.appendChild(script);
    script.remove();
  }

  injectToPage(() => {
    window.a = function () {
      const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
      return this.split("/").map((part, index) => index === 0 ? part : part.split("-").map(capitalize).join("")).join("");
    };
  });

})();