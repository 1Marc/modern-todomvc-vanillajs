export function addEvent (el, selector, event, handler) {
    el.querySelector(selector).addEventListener(event, e => handler(e));
}

export function escapeForHTML (str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function getURLHash () {
    return document.location.hash.replace(/^#\//, '');
}