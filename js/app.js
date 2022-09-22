import { getURLHash } from './helpers.js';
import { TodoStore } from './store.js';
import { AppComponent } from './component.app.js';
import { TodoListComponent } from './component.todolist.js';

const Todos = new TodoStore("todo-modern-vanillajs");
const App = new AppComponent(document, Todos, getURLHash());
const TodoList = new TodoListComponent(document.querySelector('.todo-list'), Todos, getURLHash());

const renderApp = filter => {
	App.render( filter );
	TodoList.render( filter );
}

window.addEventListener('hashchange', () => { renderApp( getURLHash() ); });
Todos.addEventListener('save', () => { renderApp( getURLHash() ) });
