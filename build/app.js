import { delegate, getURLHash, insertHTML, replaceHTML } from "./helpers.js";
import { TodoStore } from "./store.js";
const Todos = new TodoStore("todo-modern-vanillajs");
class TodoApp {
    constructor(el) {
        this.parent = el;
        this.$ = {
            input: el.querySelector('[data-todo="new"]'),
            toggleAll: el.querySelector('[data-todo="toggle-all"]'),
            clear: el.querySelector('[data-todo="clear-completed"]'),
            list: el.querySelector('[data-todo="list"]'),
        };
        this.setupUI();
    }
    setupUI() {
        Todos.addEventListener("save", this.render.bind(this));
        this.filter = getURLHash();
        window.addEventListener("hashchange", () => {
            this.filter = getURLHash();
            this.render();
        });
        this.$.input.addEventListener("keyup", (e) => {
            if (e.key === "Enter" && e.target.value.length) {
                Todos.add({
                    title: e.target.value,
                    completed: false,
                    id: "id_" + Date.now(),
                });
                this.$.input.value = "";
            }
        });
        this.$.toggleAll.addEventListener("click", (e) => {
            Todos.toggleAll();
        });
        this.$.clear.addEventListener("click", (e) => {
            Todos.clearCompleted();
        });
        this.bindTodoEvents();
        this.render();
    }
    uiShowMain(show) {
        this.parent.querySelector('[data-todo="main"]').style.display = show
            ? "block"
            : "none";
    }
    uiShowFooter(show) {
        this.parent.querySelector('[data-todo="footer"]').style.display = show
            ? "block"
            : "none";
    }
    uiShowClear(show) {
        this.$.clear.style.display = show ? "block" : "none";
    }
    uiSetActiveFilter(filter) {
        this.parent.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
            if (el.matches(`[href="#/${filter}"]`)) {
                el.classList.add("selected");
            }
            else {
                el.classList.remove("selected");
            }
        });
    }
    uiDisplayCount(count) {
        replaceHTML(this.parent.querySelector('[data-todo="count"]'), `
			<strong>${count}</strong>
			${count === 1 ? "item" : "items"} left
		`);
    }
    todoEvent(event, selector, handler) {
        delegate(this.$.list, selector, event, (e) => {
            let $el = e.target.closest("[data-id]");
            handler(Todos.get($el.dataset.id), $el, e);
        });
    }
    bindTodoEvents() {
        this.todoEvent("click", '[data-todo="destroy"]', (todo) => {
            Todos.remove(todo);
        });
        this.todoEvent("click", '[data-todo="toggle"]', (todo) => Todos.toggle(todo));
        this.todoEvent("dblclick", '[data-todo="label"]', (_, $li) => {
            $li.classList.add("editing");
            $li.querySelector('[data-todo="edit"]').focus();
        });
        this.todoEvent("keyup", '[data-todo="edit"]', (todo, $li, e) => {
            let $input = $li.querySelector('[data-todo="edit"]');
            if (e.key === "Enter" && $input.value) {
                $li.classList.remove("editing");
                Todos.update(Object.assign(Object.assign({}, todo), { title: $input.value }));
            }
            if (e.key === "Escape") {
                document.activeElement.blur();
            }
        });
        this.todoEvent("focusout", '[data-todo="edit"]', (todo, $li, e) => {
            if ($li.classList.contains("editing")) {
                let $input = $li.querySelector('[data-todo="edit"]');
                $input.value = todo.title;
                this.render();
            }
        });
    }
    createTodoItem(todo) {
        const li = document.createElement("li");
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add("completed");
        }
        insertHTML(li, `
			<div class="view">
				<input data-todo="toggle" class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}>
				<label data-todo="label"></label>
				<button class="destroy" data-todo="destroy"></button>
			</div>
			<input class="edit" data-todo="edit">
		`);
        li.querySelector('[data-todo="label"]').textContent = todo.title;
        li.querySelector('[data-todo="edit"]').value = todo.title;
        return li;
    }
    render() {
        const isTodos = !!Todos.all().length;
        this.uiSetActiveFilter(this.filter);
        this.$.list.replaceChildren(...Todos.all(this.filter).map((todo) => this.createTodoItem(todo)));
        this.uiShowMain(isTodos);
        this.uiShowFooter(isTodos);
        this.uiShowClear(Todos.hasCompleted());
        this.$.toggleAll.checked = Todos.isAllCompleted();
        this.uiDisplayCount(Todos.all("active").length);
    }
}
new TodoApp(document.body);
//# sourceMappingURL=app.js.map