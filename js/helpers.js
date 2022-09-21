export const getURLHash = () => document.location.hash.replace(/^#\//, "");

export const delegate = (el, selector, event, handler) => {
	el.addEventListener(event, (e) => {
		if (e.target.matches(selector)) handler(e, el);
	});
};

export const replaceWith = (parent, els) => {
	const f = document.createDocumentFragment();
	els.forEach((el) => f.append(el));
	parent.replaceChildren(f);
};

export const replaceHTML = (el, html) => {
	el.replaceChildren();
	el.insertAdjacentHTML("afterbegin", html);
};