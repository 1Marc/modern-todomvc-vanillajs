import { delegate } from './helpers.js';

export class TodoListComponent {
  constructor($container, Todos) {
    this.$container = $container;
    this.Todos = Todos;
    this._setupEvents();
  }
  _delegate (event, selector, handler) {
		delegate(this.$container, selector, event, e => {
			let $el = e.target.closest('[data-id]');
			handler(this.Todos.get($el.dataset.id), $el, e);
		});
	}
  _setupEvents () {
    this._delegate('click', '.destroy', (todo) => this.Todos.update(todo));
		this._delegate('click', '.toggle', (todo) =>  this.Todos.toggle(todo));
		this._delegate('dblclick', 'label', (_, $li) => {
			$li.classList.add('editing');
			$li.querySelector('.edit').focus();
		});

		this._delegate('keyup', '.edit', (todo, $li, e) => {
			let $input = $li.querySelector('.edit');
			if (e.key === 'Enter') this.Todos.update({ ...todo, title: $input.value })
			if (e.key === 'Escape') {
				$input.value = todo.title;
				this.Todos.revert();
			}
		});

		this._delegate('blur', '.edit', (todo, $li, e) => {
			const title = $li.querySelector('.edit').value;
			this.Todos.update({ ...todo, title });
		});
  }
  send (event, todo) {
    this.dispatchEvent(new CustomEvent(event, { detail: todo }));
  }
	renderTodo(todo) {
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
	}
  render ( viewFilter ) {
    this.$container.innerHTML = '';
    this.Todos.all(viewFilter).forEach(todo => {
			this.$container.appendChild( this.renderTodo(todo) );
		});
  }
}