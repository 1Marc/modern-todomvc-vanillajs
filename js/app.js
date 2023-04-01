import { render as litRender, html, nothing } from "lit-html";
import { getURLHash } from "./helpers.js";
import { TodoStore } from "./store.js";

const Todos = new TodoStore("todo-modern-vanillajs");

const App = {
  editId: "", // used to show edit field for a todo

  init() {
    Todos.addEventListener("save", App.render);
    App.filter = getURLHash();
    window.addEventListener("hashchange", () => {
      App.filter = getURLHash();
      App.render();
    });
    App.render();
  },

  createTodoItem(todo) {
    const classes = [];
    if (todo.completed) {
      classes.push("completed");
    }
    if (App.editId === todo.id) {
      classes.push("editing");
    }
    return html` <li class="${classes.join(" ")}">
      <div class="view">
        <input
          class="toggle"
          type="checkbox"
          .checked=${todo.completed}
          @click="${() => Todos.toggle(todo)}"
        />
        <label @dblclick="${() => App.editOn(todo)}">${todo.title}</label>
        <button class="destroy" @click="${() => Todos.remove(todo)}"></button>
      </div>
      <input
        class="edit"
        value="${todo.title}"
        @keyup="${(evt) => App.saveEdit(evt, todo)}"
        @blur="${(evt) => App.saveEdit(evt, todo)}"
      />
    </li>`;
  },

  saveEdit(e, todo) {
    App.editId = "";
    if ((e.type === "blur" || e.key === "Enter") && e.target.value.length) {
      Todos.update({
        id: todo.id,
        title: e.target.value,
      });
    }
  },

  saveNew(e) {
    if (e.key === "Enter" && e.target.value.length) {
      Todos.add({
        title: e.target.value,
        completed: false,
        id: "id_" + Date.now(),
      });
      e.target.value = "";
    }
  },

  editOn(todo) {
    App.editId = todo.id;
    App.render();
  },

  displayCount() {
    const count = Todos.all("active").length;
    return count
      ? html`<span class="todo-count">
          <strong>${count}</strong>
          ${count === 1 ? "item" : "items"} left
        </span>`
      : nothing;
  },

  clearButton() {
    return Todos.hasCompleted()
      ? html` <button class="clear-completed" @click="${() => Todos.clearCompleted()}">
          Clear completed
        </button>`
      : nothing;
  },

  list() {
    return Todos.all().length
      ? html`<section class="main">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            .checked=${Todos.isAllCompleted()}
            @click=${() => Todos.toggleAll()}
          />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            ${Todos.all(App.filter).map((todo) => App.createTodoItem(todo))}
          </ul>
        </section>`
      : nothing;
  },

  base() {
    return html`
      <header class="header">
        <h1>todos</h1>
        <input
          placeholder="What needs to be done?"
          autofocus
          class="new-todo"
          @keyup="${(evt) => App.saveNew(evt)}"
        />
      </header>
      ${App.list()}
      <footer class="footer">
        ${App.displayCount()}
        <ul class="filters">
          <li>
            <a class="${App.filter === "" ? "selected" : ""}" href="#/">All</a>
          </li>
          <li>
            <a class="${App.filter === "active" ? "selected" : ""}" href="#/active">Active</a>
          </li>
          <li>
            <a class="${App.filter === "completed" ? "selected" : ""}" href="#/completed"
              >Completed</a
            >
          </li>
        </ul>
        ${App.clearButton()}
      </footer>
    `;
  },
  render() {
    litRender(App.base(), document.querySelector(".todoapp"));
  },
};

App.init();
