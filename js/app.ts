import { delegate, getURLHash, insertHTML, replaceHTML } from "./helpers.js";
import { TodoStore, Todo } from "./store.js";

const Todos = new TodoStore("todo-modern-vanillajs");

interface DOMElements {
	[index: string]: HTMLElement | HTMLInputElement;
}

class TodoApp {
	parent: HTMLElement;
	$: DOMElements;
	filter: string;

	constructor(el: HTMLElement) {
		this.parent = el;

		this.$ = {
			input: el.querySelector('[data-todo="new"]') as HTMLElement,
			toggleAll: el.querySelector('[data-todo="toggle-all"]') as HTMLInputElement,
			clear: el.querySelector('[data-todo="clear-completed"]') as HTMLElement,
			list: el.querySelector('[data-todo="list"]') as HTMLElement,
		};

		this.setupUI();
	}

	setupUI(): void {
		Todos.addEventListener("save", this.render.bind(this) as EventListener);
		this.filter = getURLHash();
		window.addEventListener("hashchange", () => {
			this.filter = getURLHash();
			this.render();
		});
		this.$.input.addEventListener("keyup", (e: KeyboardEvent) => {
			if (e.key === "Enter" && (e.target as HTMLInputElement).value.length) {
				Todos.add({
					title: (e.target as HTMLInputElement).value,
					completed: false,
					id: "id_" + Date.now(),
				});
				(this.$.input as HTMLInputElement).value = "";
			}
		});
		this.$.toggleAll.addEventListener("click", (e) => {
			Todos.toggleAll();
		});
		this.$.clear.addEventListener("click", (e) => {
			Todos.clearCompleted();
		});
		this.bindTodoEvents();
		this.render();
	}

	uiShowMain(show: boolean): void {
		(this.parent.querySelector('[data-todo="main"]') as HTMLElement).style.display = show
			? "block"
			: "none";
	}

	uiShowFooter(show: boolean): void {
		(this.parent.querySelector('[data-todo="footer"]') as HTMLElement).style.display = show
			? "block"
			: "none";
	}

	uiShowClear(show: boolean): void {
		(this.$.clear as HTMLElement).style.display = show ? "block" : "none";
	}

	uiSetActiveFilter(filter: string): void {
		this.parent.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
			if (el.matches(`[href="#/${filter}"]`)) {
				el.classList.add("selected");
			} else {
				el.classList.remove("selected");
			}
		});
	}

	uiDisplayCount(count: number): void {
		replaceHTML(
			this.parent.querySelector('[data-todo="count"]'),
			`
			<strong>${count}</strong>
			${count === 1 ? "item" : "items"} left
		`
		);
	}

	todoEvent(event: keyof GlobalEventHandlersEventMap, selector: string, handler: Function): void {
		delegate(this.$.list as HTMLElement, selector, event, (e: Event) => {
			let $el = (e.target as HTMLElement).closest("[data-id]") as HTMLElement;
			handler(Todos.get($el.dataset.id), $el, e);
		});
	}

	bindTodoEvents() {
		this.todoEvent("click", '[data-todo="destroy"]', (todo: Todo) => {
			Todos.remove(todo);
		});
		this.todoEvent("click", '[data-todo="toggle"]', (todo: Todo) => Todos.toggle(todo));
		this.todoEvent("dblclick", '[data-todo="label"]', (_: Todo, $li: HTMLElement) => {
			$li.classList.add("editing");
			($li.querySelector('[data-todo="edit"]') as HTMLInputElement).focus();
		});
		this.todoEvent(
			"keyup",
			'[data-todo="edit"]',
			(todo: Todo, $li: HTMLElement, e: KeyboardEvent) => {
				let $input = $li.querySelector('[data-todo="edit"]') as HTMLInputElement;
				if (e.key === "Enter" && $input.value) {
					$li.classList.remove("editing");
					Todos.update({ ...todo, title: $input.value });
				}
				if (e.key === "Escape") {
					$input.value = todo.title;
					this.render();
				}
			}
		);
		this.todoEvent("focusout", '[data-todo="edit"]', (todo: Todo, $li: HTMLElement, e: Event) => {
			if ($li.classList.contains("editing")) {
				let $input = $li.querySelector('[data-todo="edit"]') as HTMLInputElement;
				$input.value = todo.title;
				this.render();
			}
		});
	}

	createTodoItem(todo: Todo) {
		const li = document.createElement("li");
		li.dataset.id = todo.id;
		if (todo.completed) {
			li.classList.add("completed");
		}
		insertHTML(
			li,
			`
			<div class="view">
				<input data-todo="toggle" class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}>
				<label data-todo="label"></label>
				<button class="destroy" data-todo="destroy"></button>
			</div>
			<input class="edit" data-todo="edit">
		`
		);
		li.querySelector('[data-todo="label"]').textContent = todo.title;
		(li.querySelector('[data-todo="edit"]') as HTMLInputElement).value = todo.title;
		return li;
	}

	render() {
		const isTodos = !!Todos.all().length;

		console.log(this);

		this.uiSetActiveFilter(this.filter);
		this.$.list.replaceChildren(...Todos.all(this.filter).map((todo) => this.createTodoItem(todo)));

		this.uiShowMain(isTodos);
		this.uiShowFooter(isTodos);
		this.uiShowClear(Todos.hasCompleted());
		(this.$.toggleAll as HTMLInputElement).checked = Todos.isAllCompleted();
		this.uiDisplayCount(Todos.all("active").length);
	}
}

new TodoApp(document.body);