import { replaceHTML } from "./helpers.js";
export class AppComponent {
	constructor($root, Todos, filter) {
		this.$ = {
			input: $root.querySelector(".new-todo"),
			toggleAll: $root.querySelector(".toggle-all"),
			clear: $root.querySelector(".clear-completed"),
			showMain(show) {
				$root.querySelector(".main").style.display = show ? "block" : "none";
			},
			showClear(show) {
				$root.querySelector(".clear-completed").style.display = show ? "block" : "none";
			},
			showFooter(show) {
				$root.querySelector(".footer").style.display = show ? "block" : "none";
			},
			setActiveFilter(filter) {
				$root.querySelectorAll(`.filters a`).forEach((el) => {
					if (el.matches(`[href="#/${filter}"]`)) {
						el.classList.add("selected");
					} else {
						el.classList.remove("selected");
					}
				});
			},
			displayCount(count) {
				replaceHTML(
					$root.querySelector(".todo-count"),
					`
					<strong>${count}</strong>
					${count === 1 ? "item" : "items"} left
				`
				);
			},
		};
		this.Todos = Todos;
		this.filter = filter;
		this._bindEvents();
		this.render();
	}
	_bindEvents() {
		this.$.input.addEventListener('keyup', e => {
			if (e.key === 'Enter') {
				this.Todos.add({ title: e.target.value });
				this.$.input.value = '';
			}
		});
		this.$.toggleAll.addEventListener('click', () => this.Todos.toggleAll());
		this.$.clear.addEventListener('click', () => this.Todos.clearCompleted());
	}
	render( filter ) {
		const count = this.Todos.all().length;
		if (filter !== undefined) this.filter = filter;
		this.$.setActiveFilter(this.filter);
		this.$.showMain(count);
		this.$.showFooter(count);
		this.$.showClear(this.Todos.hasCompleted());
		this.$.toggleAll.checked = this.Todos.isAllCompleted();
		this.$.displayCount(this.Todos.all('active').length);
	}
}
