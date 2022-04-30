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
			TodoStore._init();
			window.addEventListener('hashchange', () => {
				App.filter = getURLHash();
				App.render();
			});
			App.$.input.addEventListener('keyup', e => {
				if (e.keyCode === 13) {
					App.addTodo(e.target.value);
					App.$.input.value = '';
				}
			});
			App.$.toggleAll.addEventListener('click', e => {
				TodoStore.toggleAll();
				App.render();
			});
			App.$.clear.addEventListener('click', e => {
				TodoStore.clearCompleted();
				App.render();
			});
			App.render();
		},
		showFilteredTodos: function () {
			App.render();
		},
		addTodo: function(todo) {
			TodoStore.add({ title: todo, completed: false, id: "id_" + Date.now() });
			App.render();
		},
		removeTodo: function(todo) {
			TodoStore.remove(todo);
			App.render();
		},
		toggleTodo: function(todo) {
			TodoStore.toggle(todo);
			App.render();
		},
		createTodoItem: function(todo) {
			var li = document.createElement('li');
			if (todo.completed) { li.classList.add('completed'); }
	
			li.innerHTML = `
				<div class="view">
					<input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
					<label>${escapeForHTML(todo.title)}</label>
					<button class="destroy"></button>
				</div>`;

			delegate(li, 'click', '.destroy', App.removeTodo, todo);
			delegate(li, 'click', '.toggle', App.toggleTodo, todo);

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