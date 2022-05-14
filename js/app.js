import { getURLHash } from './helpers.js';
import { TodoStore } from './store.js';
import { TodoListComponent } from './todo_list.js';

const Todos = new TodoStore('todo-vanillajs-2022');
const TodoList = new TodoListComponent(document.querySelector('.todo-list'), Todos);

const App = {
	filter: getURLHash(),
	$: {
		input:		document.querySelector('.new-todo'),
		count: 		document.querySelector('.todo-count'),
		footer: 	document.querySelector('.footer'),
		toggleAll: 	document.querySelector('.toggle-all'),
		main: 		document.querySelector('.main'),
		clear: 		document.querySelector('.clear-completed'),
		filters: 	document.querySelectorAll('.filters a'),
		filter: (() => document.querySelector(`[href="#/${App.filter}"]`)),
	},
	init() {
		Todos.addEventListener('save', App.render);
		window.addEventListener('hashchange', () => {
			App.filter = getURLHash();
			App.render();
		});
		App.$.input.addEventListener('keyup', e => {
			if (e.key === 'Enter') {
				Todos.add({ title: e.target.value });
				App.$.input.value = '';
			}
		});
		App.$.toggleAll.addEventListener('click', e => {
			Todos.toggleAll();
		});
		App.$.clear.addEventListener('click', e => {
			Todos.clearCompleted();
		});
		App.render();
	},
	render() {
		const todosCount = Todos.all().length;
		App.$.filters.forEach(el => el.classList.remove('selected'));
		App.$.filter().classList.add('selected');
		App.$.footer.style.display = todosCount ? 'block' : 'none';
		App.$.main.style.display = todosCount ? 'block' : 'none';
		App.$.clear.style.display = Todos.hasCompleted() ? 'block' : 'none';
		App.$.toggleAll.checked = todosCount && Todos.isAllCompleted();
		App.$.count.innerHTML = `
			<strong>${Todos.all('active').length}</strong>
			${Todos.all('active').length === 1 ? 'item' : 'items'} left
		`;
		TodoList.render( App.filter );
	}
};

App.init();