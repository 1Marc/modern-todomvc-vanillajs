# TodoMVC App Written in Vanilla JS in 2022

Seems it is pretty straightforward to build reasonably complex things using only modern JavaScript these days! We can take advantage of most newer features without hacks or polyfills.

Here's my Vanilla JavaScript implementation:

- 184 lines of code total (compared to the official vanilla JS TodoMVC from 6 years ago was 900+ LOC)
- No build tools
- JavaScript modules

[View the working example on GitHub pages](https://1marc.github.io/todomvc-vanillajs-2022/)

Related poll: "Would you build a large web app in 2022 with Vanilla JS?" https://twitter.com/1Marc/status/1520146662924206082

Criticism, PRs, and feedback are welcome!

# Additional Examples

## App Architecture

People were concerned about the scalability of apps like this since there are no components, and it's all one App. So I extracted the TodoList and App components and wired the components together on the app-architecture branch.

Branch: https://github.com/1Marc/todomvc-vanillajs-2022/tree/app-architecture

Note: I realize it is silly to say the word "scalable" in the context of a todo app, but this should be looked at as a blueprint for building something more extensive. I plan to make more ambitious examples in the future to show what's possible.

## Initial Code

The initial version came together in only 60 minutes, then ~30 min of refactoring: [see the commit here](https://github.com/1Marc/todomvc-vanillajs-2022/tree/fb3c61ed104c440f0c29e3a074b6777c791aa2f6)

How quick it was to get working was what initially got me pumped about all of the progress in the core JavaScript language.

## Highlights / Potential Learnings from the Code

### Sanitization

User input must be sanitized before being displayed in the HTML to prevent XSS (Cross-Site Scripting). Therefore new todo titles are added to the template string using `textContent`

```javascript
li.querySelector('label').textContent = todo.title;
```

### Event Delegation

Since we render the todos frequently, it doesn't make sense to bind event listeners and clean them up every time. Instead, we bind our events to the parent list that always exists in the DOM and infer which todo was clicked or edited by setting the data attribute of the item `$li.dataset.id = todo.id;`

Event delgation uses the `matches` selector:

```javascript
export const delegate = (el, selector, event, handler) => {
    el.addEventListener(event, e => {
        if (e.target.matches(selector)) handler(e, el);
    });
}
```

When something inside the list is clicked, we read that data attribute id from the inner list item and use it to grab the todo from the model:

```javascript
delegate(App.$.list, selector, event, e => {
	let $el = e.target.closest('[data-id]');
	handler(Todos.get($el.dataset.id), $el, e);
});
```

### insertAdjacentHTML

insertAdjacentHTML is [much faster](https://www.measurethat.net/Benchmarks/Show/10750/0/insertadjacenthtml-vs-innerhtml#latest_results_block) than innerHTML because it doesn't have to destroy the DOM first before inserting.

```javascript
export const insertHTML = (el, markup) => {
	el.insertAdjacentHTML('afterbegin', markup);
}
```

I also quite like this remove all child nodes helper which is a fast way to clear the contents of an element:

```javascript
export const emptyElement = el => {
	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}
```

### Grouping DOM Selectors & Methods

DOM selectors and modifications are scoped to the `App.$.*` namespace. In a way, it makes it self-documenting what our App could potentially modify in the document.

```javascript
$: {
	input:		document.querySelector('.new-todo'),
	toggleAll:	document.querySelector('.toggle-all'),
	clear:		document.querySelector('.clear-completed'),
	list:		document.querySelector('.todo-list'),
	count:		document.querySelector('.todo-count'),
	setActiveFilter: filter => {
		document.querySelectorAll('.filters a').forEach(el => el.classList.remove('selected')),
		document.querySelector(`.filters [href="#/${filter}"]`).classList.add('selected');
	},
	showMain: show =>
		document.querySelector('.main').style.display = show ? 'block': 'none',
	showClear: show =>
		document.querySelector('.clear-completed').style.display = show ? 'block': 'none',
	showFooter: show =>
		document.querySelector('.footer').style.display = show ? 'block': 'none',
	displayCount: count => {
		emptyElement(App.$.count);
		insertHTML(App.$.count, `
			<strong>${count}</strong>
			${count === 1 ? 'item' : 'items'} left
		`);
	}
},
```

### Send Events on a Class Instance with Subclassing EventTarget

We can subclass EventTarget to send out events on a class instance for our App to bind to:

```javascript
export const TodoStore = class extends EventTarget {
```

In this case, when the store updates it sends an event:

```javascript
this.dispatchEvent(new CustomEvent('save'));
```

The App listens to that event and re-renders itself based on the new store data:
 
```javascript
Todos.addEventListener('save', App.render);
```

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dct:type">work</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://sindresorhus.com" property="cc:attributionName" rel="cc:attributionURL">TasteJS</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
