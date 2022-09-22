export const TodoStore = class extends EventTarget {
	constructor(localStorageKey) {
		super();
		this.localStorageKey = localStorageKey;
		this._readStorage();
		// handle todos edited in another window
		window.addEventListener(
			"storage",
			() => {
				this._readStorage();
				this._save();
			},
			false
		);
		// GETTER methods
		this.get = (id) => this.todos.find((todo) => todo.id === id);
		this.isAllCompleted = () => this.todos.every((todo) => todo.completed);
		this.hasCompleted = () => this.todos.some((todo) => todo.completed);
		this.all = (filter) =>
			filter === "active"
				? this.todos.filter((todo) => !todo.completed)
				: filter === "completed"
				? this.todos.filter((todo) => todo.completed)
				: this.todos;
	}
	_readStorage() {
		this.todos = JSON.parse(window.localStorage.getItem(this.localStorageKey) || "[]");
	}
	_save(event, data) {
		window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
		this.dispatchEvent(new CustomEvent(event ? event : "save", data ? { detail: data } : null));
	}
	// MUTATE methods
	add(todo) {
		let newTodo = {
			title: todo.title,
			completed: false,
			id: "id_" + Date.now(),
		};
		this.todos.push(newTodo);
		this._save("add", newTodo);
	}
	remove({ id }) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
		this._save("remove", id);
	}
	toggle({ id }) {
		this.todos = this.todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		this._save(
			"toggle",
			this.todos.find((todo) => id === todo.id)
		);
	}
	clearCompleted() {
		let cleared = this.todos.filter((todo) => todo.completed);
		this.todos = this.todos.filter((todo) => !todo.completed);
		this._save("clear", cleared);
	}
	update(todo) {
		this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
		this._save(
			"update",
			this.todos.find((todo) => id === todo.id)
		);
	}
	toggleAll() {
		const completed = !this.hasCompleted() || !this.isAllCompleted();
		this.todos = this.todos.map((todo) => ({ ...todo, completed }));
		this._save();
	}
	revert() {
		this._save();
	}
};
