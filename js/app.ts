import { delegate, getURLHash, insertHTML, replaceHTML } from "./helpers.js";
import { TodoStore, Todo } from "./store.js";

const Todos = new TodoStore("todo-modern-vanillajs");

type App = {
	$: { [key: string]: HTMLElement | Function };
	filter: string;
	init: Function;
	todoEvent: Function;
	bindTodoEvents: Function;
	createTodoItem: Function;
	render: Function;
};

const App: App = {
	filter: "",
	$: {
		input: document.querySelector('[data-todo="new"]') as HTMLElement,
		toggleAll: document.querySelector('[data-todo="toggle-all"]') as HTMLElement,
		clear: document.querySelector('[data-todo="clear-completed"]') as HTMLElement,
		list: document.querySelector('[data-todo="list"]') as HTMLElement,
		showMain(show: boolean): void {
			(document.querySelector('[data-todo="main"]') as HTMLElement).style.display = show
				? "block"
				: "none";
		},
		showFooter(show: boolean): void {
			(document.querySelector('[data-todo="footer"]') as HTMLElement).style.display = show
				? "block"
				: "none";
		},
		showClear(show: boolean): void {
			(App.$.clear as HTMLElement).style.display = show ? "block" : "none";
		},
		setActiveFilter(filter: string): void {
			document.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
				if (el.matches(`[href="#/${filter}"]`)) {
					el.classList.add("selected");
				} else {
					el.classList.remove("selected");
				}
			});
		},
		displayCount(count: number): void {
			replaceHTML(
				document.querySelector('[data-todo="count"]'),
				`
				<strong>${count}</strong>
				${count === 1 ? "item" : "items"} left
			`
			);
		},
	},
	init() {
		Todos.addEventListener("save", App.render as EventListener);
		App.filter = getURLHash();
		window.addEventListener("hashchange", () => {
			App.filter = getURLHash();
			App.render();
		});
		(App.$.input as HTMLInputElement).addEventListener("keyup", (e) => {
			if (e.key === "Enter" && (e.target as HTMLInputElement).value.length) {
				Todos.add({
					title: (e.target as HTMLInputElement).value,
					completed: false,
					id: "id_" + Date.now(),
				});
				(App.$.input as HTMLInputElement).value = "";
			}
		});
		(App.$.toggleAll as HTMLElement).addEventListener("click", (e) => {
			Todos.toggleAll();
		});
		(App.$.clear as HTMLElement).addEventListener("click", (e) => {
			Todos.clearCompleted();
		});
		App.bindTodoEvents();
		App.render();
	},
	todoEvent(event: keyof GlobalEventHandlersEventMap, selector: string, handler: Function): void {
		delegate(App.$.list as HTMLElement, selector, event, (e: Event) => {
			let $el = (e.target as HTMLElement).closest("[data-id]") as HTMLElement;
			handler(Todos.get($el.dataset.id), $el, e);
		});
	},
	bindTodoEvents() {
		App.todoEvent("click", '[data-todo="destroy"]', (todo: Todo) => Todos.remove(todo));
		App.todoEvent("click", '[data-todo="toggle"]', (todo: Todo) => Todos.toggle(todo));
		App.todoEvent("dblclick", '[data-todo="label"]', (_: Todo, $li: HTMLElement) => {
			$li.classList.add("editing");
			($li.querySelector('[data-todo="edit"]') as HTMLInputElement).focus();
		});
		App.todoEvent(
			"keyup",
			'[data-todo="edit"]',
			(todo: Todo, $li: HTMLElement, e: KeyboardEvent) => {
				let $input = $li.querySelector('[data-todo="edit"]') as HTMLInputElement;
				if (e.key === "Enter" && $input.value) Todos.update({ ...todo, title: $input.value });
				if (e.key === "Escape") {
					$input.value = todo.title;
					App.render();
				}
			}
		);
		App.todoEvent("focusout", '[data-todo="edit"]', (todo: Todo, $li: HTMLElement, e: Event) => {
			const title = ($li.querySelector('[data-todo="edit"]') as HTMLInputElement).value;
			Todos.update({ ...todo, title });
		});
	},
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
	},
	render() {
		const count = Todos.all().length;
		(App.$.setActiveFilter as Function)(App.filter);
		(App.$.list as HTMLElement).replaceChildren(
			...Todos.all(App.filter).map((todo) => App.createTodoItem(todo))
		);
		(App.$.showMain as Function)(count);
		(App.$.showFooter as Function)(count);
		(App.$.showClear as Function)(Todos.hasCompleted());
		(App.$.toggleAll as HTMLInputElement).checked = Todos.isAllCompleted();
		(App.$.displayCount as Function)(Todos.all("active").length);
	},
};

App.init();
