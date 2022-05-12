export const addEvent = (el, selector, event, handler) => {
    el.querySelector(selector).addEventListener(event, e => handler(e));
}

export const getURLHash = () => document.location.hash.replace(/^#\//, '');

export const delegate = (el, selector, event, handler) => {
    el.addEventListener(event, e => {
        if (e.target.matches(selector)) handler(e, el);
    });
}