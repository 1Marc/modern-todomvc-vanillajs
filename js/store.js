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
	_save() {
		window.localStorage.setItem(
			this.localStorageKey,
			JSON.stringify(this.todos)
		);
		this.dispatchEvent(new CustomEvent("save"));
	}
	// MUTATE methods
	add(todo) {
		// Remove any leading or trailing whitespace from the todo title
		const trimmedTodoTitle = todo.title.trim();
		// Check if the trimmed todo title is not an empty string
		if(trimmedTodoTitle){	
			this.todos.push({
				// Set the title of the new todo to the trimmed todo title
				title: trimmedTodoTitle,
				completed: false,
				id: "id_" + Date.now(),
			});
			this._save();
		}
	}
	remove({ id }) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
		this._save();
	}
	toggle({ id }) {
		this.todos = this.todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		this._save();
	}
	clearCompleted() {
		this.todos = this.todos.filter((todo) => !todo.completed);
		this._save();
	}
	update(todo) {
		this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
		this._save();
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
