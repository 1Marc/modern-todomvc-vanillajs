export const getURLHash = () => document.location.hash.replace(/^#\//, '');

export const delegate = (el, selector, event, handler) => {
    el.addEventListener(event, e => {
        if (e.target.matches(selector)) handler(e, el);
    });
}

export const insertHTML = (el, markup) => {
	el.insertAdjacentHTML('afterbegin', markup);
}

export const emptyElement = el => {
    while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}
