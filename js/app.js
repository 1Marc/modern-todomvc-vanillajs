import { addEvent, delegate, getURLHash } from './helpers.js';
import { TodoStore } from './store.js';

const Todos = new TodoStore('todo-vanillajs-2022');

const App = {
	$: {
		input:		document.querySelector('.new-todo'),
		list: 		document.querySelector('.todo-list'),
		count: 		document.querySelector('.todo-count'),
		footer: 	document.querySelector('.footer'),
		toggleAll: 	document.querySelector('.toggle-all'),
		main: 		document.querySelector('.main'),
		clear: 		document.querySelector('.clear-completed'),
		filters: 	document.querySelector('.filters'),
	},
	filter: getURLHash(),
	init() {
		Todos.addEventListener('save', App.render);
		window.addEventListener('hashchange', () => {
			App.filter = getURLHash();
			App.render();
		});
		App.$.input.addEventListener('keyup', e => {
			if (e.key === 'Enter') {
				App.addTodo(e.target.value);
				App.$.input.value = '';
			}
		});
		App.$.toggleAll.addEventListener('click', e => {
			Todos.toggleAll();
		});
		App.$.clear.addEventListener('click', e => {
			Todos.clearCompleted();
		});
		App.initTodoItemEvents();
		App.render();
	},
	addTodo(todo) {
		Todos.add({ title: todo, completed: false, id: "id_" + Date.now() });
	},
	removeTodo(todo) {
		Todos.remove(todo);
	},
	toggleTodo(todo) {
		Todos.toggle(todo);
	},
	updateTodo(todo) {
		Todos.update(todo);
	},
	delegateTodo(event, selector, handler) {
		delegate(App.$.list, selector, event, e => {
			let $el = e.target.closest('[data-id]');
			handler(Todos.get($el.dataset.id), $el, e);
		});
	},
	initTodoItemEvents() {
		App.delegateTodo('click', '.destroy', (todo) => App.removeTodo(todo));
		App.delegateTodo('click', '.toggle', (todo) => App.toggleTodo(todo));
		App.delegateTodo('dblclick', 'label', (todo, $li) => {
			$li.classList.add('editing');
			$li.querySelector('.edit').focus();
		});

		App.delegateTodo('keyup', '.edit', (todo, $li, e) => {
			let $input = $li.querySelector('.edit');
			if (e.key === 'Enter') App.updateTodo({ ...todo, title: $input.value });
			if (e.key === 'Escape') {
				$input.value = todo.title;
				App.render();
			}
		});

		App.delegateTodo('blur', '.edit', (todo, $li, e) => {
			const title = $li.querySelector('.edit').value;
			App.updateTodo({ ...todo, title }, li);
		});
	},
	createTodoItem(todo) {
		const li = document.createElement('li');
		li.dataset.id = todo.id;
		if (todo.completed) { li.classList.add('completed'); }

		li.innerHTML = `
			<div class="view">
				<input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
				<label></label>
				<button class="destroy"></button>
			</div>
			<input class="edit">
		`;

		li.querySelector('label').textContent = todo.title;
		li.querySelector('.edit').value = todo.title;

		return li;
	},
	render() {
		const todosCount = Todos.all().length;
		App.$.filters.querySelectorAll('a').forEach(el => el.classList.remove('selected'));
		App.$.filters.querySelector(`[href="#/${App.filter}"]`).classList.add('selected');
		App.$.list.innerHTML = '';
		Todos.all(App.filter).forEach(todo => {
			App.$.list.appendChild( App.createTodoItem(todo) );
		});
		App.$.footer.style.display = todosCount ? 'block' : 'none';
		App.$.main.style.display = todosCount ? 'block' : 'none';
		App.$.clear.style.display = Todos.hasCompleted() ? 'block' : 'none';
		App.$.toggleAll.checked = todosCount && Todos.isAllCompleted();
		App.$.count.innerHTML = `
			<strong>${Todos.all('active').length}</strong>
			${Todos.all('active').length === 1 ? 'item' : 'items'} left
		`;
	}
};

App.init();