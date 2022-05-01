export const TodoStore = {
    emitter: new EventTarget(),
    _init: function () {
        this.todos = JSON.parse(window.localStorage.getItem('todo-vanillajs-2022') || '[]');
        this.emitter.addEventListener('save', this._persist.bind(this));
        return this.emitter;
    },
    _persist: function () {
        window.localStorage.setItem('todo-vanillajs-2022', JSON.stringify(this.todos));
    },
    _save: function () {
        this.emitter.dispatchEvent(new CustomEvent('save'));
    },
    // GETTER methods
    all: function (viewFilter) {
        if (viewFilter === 'active') {
            return this.todos.filter(todo => !todo.completed);
        }
        if (viewFilter === 'completed') {
            return this.todos.filter(todo => todo.completed);
        }
        return this.todos;
    },
    hasCompleted: function () {
        return this.todos.some(todo => todo.completed);
    },
    isAllCompleted: function() {
        return this.todos.every(todo => todo.completed);
    },
    // MUTATE methods
    add: function (todo) {
        this.todos.push({ title: todo.title, completed: false, id: "id_" + Date.now() });
        this._save();
    },
    remove: function ({ id }) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this._save();
    },
    toggle: function ({ id }) {
        this.todos = this.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        this._save();
    },
    clearCompleted: function() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this._save();
    },
    update: function(todo) {
        this.todos = this.todos.map(t => t.id === todo.id ? todo : t);
        this._save();
    },
    toggleAll: function () {
        if (this.hasCompleted()) {
            if (this.isAllCompleted()) {
                this.todos = this.todos.map(todo => ({ ...todo, completed: false }));
            } else {
                this.todos = this.todos.map(todo => ({ ...todo, completed: true }));
            }
        } else {
            this.todos = this.todos.map(todo => ({ ...todo, completed: true }));
        }
        this._save();
    }
};