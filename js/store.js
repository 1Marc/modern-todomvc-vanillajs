export const TodoStore = {
    _init: function () {
        this.todos = JSON.parse(window.localStorage.getItem('todo-vanillajs-2022') || '[]');
    },
    _save: function () {
        window.localStorage.setItem('todo-vanillajs-2022', JSON.stringify(this.todos));
    },
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
    allCompleted: function() {
        return this.todos.every(todo => todo.completed)
    },
    toggleAll: function () {
        const hasCompleted = this.hasCompleted();

        if (hasCompleted) {
            if (this.allCompleted()) {
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