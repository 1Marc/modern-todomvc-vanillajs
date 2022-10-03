export const getURLHash = () => (document.location.hash as string).replace(/^#\//, "");

export const delegate = (
	el: HTMLElement,
	selector: string,
	event: keyof GlobalEventHandlersEventMap,
	handler: (e: Event, el: HTMLElement) => void
) => {
	el.addEventListener(event, (e) => {
		if ((e.target as HTMLElement).matches(selector)) handler(e, el);
	});
};

export const insertHTML = (el: HTMLElement, html: string) =>
	el.insertAdjacentHTML("afterbegin", html);

export const replaceHTML = (el: HTMLElement, html: string) => {
	el.replaceChildren();
	insertHTML(el, html);
};
