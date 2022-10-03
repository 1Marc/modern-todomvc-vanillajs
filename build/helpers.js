export var getURLHash = function () { return document.location.hash.replace(/^#\//, ""); };
export var delegate = function (el, selector, event, handler) {
    el.addEventListener(event, function (e) {
        if (e.target.matches(selector))
            handler(e, el);
    });
};
export var insertHTML = function (el, html) {
    return el.insertAdjacentHTML("afterbegin", html);
};
export var replaceHTML = function (el, html) {
    el.replaceChildren();
    insertHTML(el, html);
};
//# sourceMappingURL=helpers.js.map