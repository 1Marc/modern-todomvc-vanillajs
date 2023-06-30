import {clone, isReference, updateSubject, uuid} from 'https://edge.js.m-ld.org/ext/index.mjs';
import {MemoryLevel} from 'https://edge.js.m-ld.org/ext/memory-level.mjs';
import {IoRemotes} from 'https://edge.js.m-ld.org/ext/socket.io.mjs';

/**
 * @typedef {object} Todo
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 */

/**
 * Singleton API for current Todos
 * @type {TodoStore}
 */
export class TodoStore extends EventTarget {
	constructor(todosId, isNew) {
		super();
		this.id = todosId;
		this._readStorage(isNew);
		// GETTER methods
		this.get = (id) => this.todos.find((todo) => todo['@id'] === id);
		this.isAllCompleted = () => this.todos.every((todo) => todo.completed);
		this.hasCompleted = () => this.todos.some((todo) => todo.completed);
		this.all = (filter) =>
			filter === "active"
				? this.todos.filter((todo) => !todo.completed)
				: filter === "completed"
				? this.todos.filter((todo) => todo.completed)
				: this.todos;
	}
	_handleError = (error) => {
		this.dispatchEvent(new ErrorEvent('error', {error}));
	};
	_readStorage(isNew) {
		this.todos = [];
		const loadTodoReferences = async (state) => {
			await Promise.all(this.todos.map(async (todo, i) => {
				if (isReference(todo))
					this.todos[i] = await state.get(todo['@id']);
			}));
			console.log(this.todos);
			this.dispatchEvent(new CustomEvent("save"));
		};
		clone(new MemoryLevel, IoRemotes, {
			'@id': uuid(),
			'@domain': `${this.id}.todomvc.m-ld.org`,
			genesis: isNew,
			io: {uri: 'http://localhost:3001'}
		}).then(async meld => {
			this.meld = meld;
			await meld.status.becomes({ outdated: false });
			meld.read(async state => {
				this.todos = (await state.get('todos'))?.['@list'] ?? [];
				await loadTodoReferences(state);
			}, async (update, state) => {
				updateSubject({'@id': 'todos', '@list': this.todos}, update);
				await loadTodoReferences(state);
			});
		}).catch(this._handleError);
	}
	_save(write) {
		this.meld.write(write).catch(this._handleError);
	}
	// MUTATE methods
	add({ title }) {
		this._save({
			'@id': 'todos',
			'@list': {
				[this.todos.length]: {
					title,
					completed: false,
					'@id': "id_" + Date.now(),
				}
			}
		});
	}
	remove({ '@id': id }) {
		this._save({
			'@delete': {
				'@id': 'todos',
				'@list': {'?': {'@id': id, '?': '?'}}
			}
		});
	}
	toggle({ '@id': id, completed }) {
		this._save({
			'@update': {'@id': id, completed: !completed}
		});
	}
	clearCompleted() {
		this.todos = this.todos.filter((todo) => !todo.completed);
		this._save({
			'@delete': {
				'@id': 'todos',
				'@list': {'?': {completed: true, '?': '?'}}
			}
		});
	}
	update({ '@id': id, title }) {
		this._save({
			'@update': {'@id': id, title}
		});
	}
	toggleAll() {
		const completed = !this.hasCompleted() || !this.isAllCompleted();
		this._save({
			// TODO: This ought to be possible with @update
			'@delete': {'@id': '?id', completed: !completed},
			'@insert': {'@id': '?id', completed},
			'@where': {'@id': '?id', completed: !completed}
		});
	}
	close() {
		this.meld?.close().catch(console.error);
	}
}
