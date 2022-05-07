export const addEvent = (el, selector, event, handler) =>{
    el.querySelector(selector).addEventListener(event, e => handler(e));
}

export const getURLHash = () => document.location.hash.replace(/^#\//, '');