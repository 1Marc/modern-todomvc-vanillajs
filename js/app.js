import { delegate, escapeForHTML, getURLHash } from './helpers.js';
import { TodoStore } from './store.js';

(function (window) {
	'use strict';

	const App = {
		$: {
			input:		document.querySelector('.new-todo'),
			list: 		document.querySelector('.todo-list'),
			count: 		document.querySelector('.todo-count strong'),
			footer: 	document.querySelector('.footer'),
			toggleAll: 	document.querySelector('.toggle-all'),
			main: 		document.querySelector('.main'),
			clear: 		document.querySelector('.clear-completed'),
			filters: 	document.querySelector('.filters'),
		},
		filter: getURLHash(),
		_init: function () {
			TodoStore._init().addEventListener('save', App.render);
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
				TodoStore.toggleAll();
			});
			App.$.clear.addEventListener('click', e => {
				TodoStore.clearCompleted();
			});
			App.render();
		},
		addTodo: function(todo) {
			TodoStore.add({ title: todo, completed: false, id: "id_" + Date.now() });
		},
		removeTodo: function(todo) {
			TodoStore.remove(todo);
		},
		toggleTodo: function(todo) {
			TodoStore.toggle(todo);
		},
		updateTodo: function(todo, listItem, e) {
			if (e.key === 'Enter') {
				todo.title = e.target.value;
				TodoStore.update(todo);
				listItem.classList.remove('editing');
			}
		},
		editingTodo: function(todo, listItem) {
			listItem.classList.add('editing');
			listItem.querySelector('.edit').focus();
		},
		createTodoItem: function(todo) {
			const li = document.createElement('li');
			if (todo.completed) { li.classList.add('completed'); }
	
			li.innerHTML = `
				<div class="view">
					<input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
					<label>${escapeForHTML(todo.title)}</label>
					<button class="destroy"></button>
				</div>
				<input class="edit" value="${escapeForHTML(todo.title)}">`;

			delegate(li, 'click', '.destroy', App.removeTodo, todo);
			delegate(li, 'click', '.toggle', App.toggleTodo, todo);
			delegate(li, 'keyup', '.edit', App.updateTodo, todo);
			delegate(li, 'dblclick', 'li label', App.editingTodo, todo);

			return li;
		},
		render: function() {
			const todos = TodoStore.all(App.filter);
			const todosCount = TodoStore.all().length;
			App.$.filters.querySelectorAll('a').forEach(el => el.classList.remove('selected'));
			App.$.filters.querySelector(`[href="#/${App.filter}"]`).classList.add('selected');
			App.$.list.innerHTML = '';
			todos.forEach(todo => {
				App.$.list.appendChild( App.createTodoItem(todo) );
			});
			App.$.footer.style.display = todosCount ? 'block' : 'none';
			App.$.main.style.display = todosCount ? 'block' : 'none';
			App.$.clear.style.display = TodoStore.hasCompleted() ? 'block' : 'none';
			App.$.toggleAll.checked = todosCount && todos.every(todo => todo.completed);
			App.$.count.innerHTML = TodoStore.all('active').length;
		}
	}

	App._init();

	window.TodoApp = App;
})(window);
