import { delegate, getURLHash } from "./helpers.js";
import { TodoStore } from "./store.js";
import { html, render } from "/node_modules/lit-html/lit-html.js";
import { repeat } from "/node_modules/lit-html/directives/repeat.js";

const Todos = new TodoStore("todo-vanillajs-2022");

const App = {
	$: {
		input: document.querySelector('[data-todo="new"]'),
		toggleAll: document.querySelector('[data-todo="toggle-all"]'),
		clear: document.querySelector('[data-todo="clear-completed"]'),
		list: document.querySelector('[data-todo="list"]'),
		setActiveFilter(filter) {
			document.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
				if (el.matches(`[href="#/${filter}"]`)) {
					el.classList.add('selected');
				} else {
					el.classList.remove('selected');
				}
			});
		},
		showClear(show) {
			App.$.clear.style.display = show ? 'block' : 'none';
		},
		showMain(show) {
			document.querySelector('[data-todo="main"]').style.display = show ? 'block' : 'none';
		},
		showFooter(show) {
			document.querySelector('[data-todo="footer"]').style.display = show ? 'block' : 'none';
		},
		displayCount(count) {
			render(html`
					<strong>${count}</strong>
					${count === 1 ? 'item' : 'items'} left
			`,
			document.querySelector('[data-todo="count"]'));
		},
	},
	init() {
		Todos.addEventListener("save", App.render);
		App.filter = getURLHash();
		window.addEventListener("hashchange", () => {
			App.filter = getURLHash();
			App.render();
		});
		App.$.input.addEventListener('keyup', (e) => {
			if (e.key === 'Enter' && e.target.value.length) {
				Todos.add({
					title: e.target.value,
					completed: false,
					id: 'id_' + Date.now(),
				});
				App.$.input.value = '';
			}
		});
		App.$.toggleAll.addEventListener('click', (e) => {
			Todos.toggleAll();
		});
		App.$.clear.addEventListener('click', (e) => {
			Todos.clearCompleted();
		});
		App.bindTodoEvents();
		App.render();
	},
	todoEvent(event, selector, handler) {
		delegate(App.$.list, selector, event, (e) => {
			let $el = e.target.closest('[data-id]');
			handler(Todos.get($el.dataset.id), $el, e);
		});
	},
	bindTodoEvents() {
		App.todoEvent('click', '[data-todo="destroy"]', (todo, $li) => {
			$li.classList.add("remove");
			setTimeout(function () {
				Todos.remove(todo);
			}, 500);
		});
		App.todoEvent('click', '[data-todo="toggle"]', (todo) => Todos.toggle(todo));
		App.todoEvent('dblclick', '[data-todo="label"]', (_, $li) => {
			$li.classList.add('editing');
			$li.querySelector('[data-todo="edit"]').focus();
		});
		App.todoEvent("click", '[data-todo="toggle"]', (todo) =>
			Todos.toggle(todo)
		);
		App.todoEvent("dblclick", '[data-todo="label"]', (_, $li) => {
			$li.classList.add("editing");
			$li.querySelector('[data-todo="edit"]').focus();
			$li.querySelector(".new").classList.remove("new");
		});
		App.todoEvent("keyup", '[data-todo="edit"]', (todo, $li, e) => {
			let $input = $li.querySelector('[data-todo="edit"]');
			if (e.key === 'Enter' && $input.value) Todos.update({ ...todo, title: $input.value });
			if (e.key === 'Escape') {
				$input.value = todo.title;
				$li.classList.remove("editing");
				App.render();
			}
		});
		App.todoEvent("blur", '[data-todo="edit"]', (todo, $li, e) => {
			const title = $li.querySelector('[data-todo="edit"]').value;
			Todos.update({ ...todo, title });
		});
	},
	createTodoItem(todo) {
		const item = html`
			<li data-id="${todo.id}">
				<div class="view new">
					<input
						data-todo="toggle"
						type="checkbox"
						class="toggle"
						?checked=${todo.completed}
					/>
					<label data-todo="label">${todo.title}</label>
					<button class="destroy" data-todo="destroy"></button>
				</div>
				<input class="edit" data-todo="edit" value="${todo.title}" />
			</li>
		`;
		return item;
	},
	render() {
		const count = Todos.all().length;
		App.$.setActiveFilter(App.filter);
		const todos = Todos.all(App.filter);
		render(
			repeat(
				todos,
				(todo) => todo.id,
				(todo) => App.createTodoItem(todo)
			),
			App.$.list
		);
		App.$.showMain(count);
		App.$.showFooter(count);
		App.$.showClear(Todos.hasCompleted());
		App.$.toggleAll.checked = Todos.isAllCompleted();
		App.$.displayCount(Todos.all('active').length);
	},
};

App.init();
