export class AppComponent {
	constructor($root, Todos) {
		this.$ = {
			input:      $root.querySelector('.new-todo'),
			toggleAll:  $root.querySelector('.toggle-all'),
			clear:      $root.querySelector('.clear-completed'),
			setActiveFilter: filter => {
				$root.querySelectorAll('.filters a').forEach(el => el.classList.remove('selected')),
				$root.querySelector(`[href="#/${filter}"]`).classList.add('selected');
			},
			showMain: show =>
				$root.querySelector('.main').style.display = show ? 'block': 'none',
			showClear: show =>
				$root.querySelector('.clear-completed').style.display = show ? 'block': 'none',
			showFooter: show =>
				$root.querySelector('.footer').style.display = show ? 'block': 'none',
			displayCount: count =>
				$root.querySelector('.todo-count').innerHTML = `
					<strong>${count}</strong>
					${count === 1 ? 'item' : 'items'} left
				`
		};
		this.Todos = Todos;
		this.filter = false;
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
		if (filter) this.$.setActiveFilter(filter);
		this.$.showMain(count);
		this.$.showFooter(count);
		this.$.showClear(this.Todos.hasCompleted());
		this.$.toggleAll.checked = this.Todos.isAllCompleted();
		this.$.displayCount(this.Todos.all('active').length);
	}
}
