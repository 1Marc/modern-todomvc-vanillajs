export const addEvent = (el, selector, event, handler) =>
    el.querySelector(selector).addEventListener(event, e => handler(e));

export const escapeForHTML (str) =>
    str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export const getURLHash () => document.location.hash.replace(/^#\//, '');
