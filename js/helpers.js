export const addEvent = (el, selector, event, handler) =>{
    el.querySelector(selector).addEventListener(event, e => handler(e));
}

export const getURLHash = () => document.location.hash.replace(/^#\//, '');

export const insertAfterBegin = (el, markup) => el.insertAdjacentHTML('afterbegin', markup);

export const removeChildNodes = el => {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild)
    }
}
