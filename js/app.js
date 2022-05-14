import { getURLHash } from './helpers.js';
import { TodoStore } from './store.js';
import { AppComponent } from './component.app.js';
import { TodoListComponent } from './component.todolist.js';

const Todos = new TodoStore('todo-vanillajs-2022');
const App = new AppComponent(document, Todos);
const TodoList = new TodoListComponent(document.querySelector('.todo-list'), Todos);

const renderApp = filter => {
	App.render( filter );
	TodoList.render( filter );
}

window.addEventListener('hashchange', () => { renderApp( getURLHash() ); });
Todos.addEventListener('save', () => { renderApp( getURLHash() ) });
