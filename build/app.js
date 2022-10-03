var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { delegate, getURLHash, insertHTML, replaceHTML } from "./helpers.js";
import { TodoStore } from "./store.js";
var Todos = new TodoStore("todo-modern-vanillajs");
var App = {
    filter: "",
    $: {
        input: document.querySelector('[data-todo="new"]'),
        toggleAll: document.querySelector('[data-todo="toggle-all"]'),
        clear: document.querySelector('[data-todo="clear-completed"]'),
        list: document.querySelector('[data-todo="list"]'),
        showMain: function (show) {
            document.querySelector('[data-todo="main"]').style.display = show
                ? "block"
                : "none";
        },
        showFooter: function (show) {
            document.querySelector('[data-todo="footer"]').style.display = show
                ? "block"
                : "none";
        },
        showClear: function (show) {
            App.$.clear.style.display = show ? "block" : "none";
        },
        setActiveFilter: function (filter) {
            document.querySelectorAll("[data-todo=\"filters\"] a").forEach(function (el) {
                if (el.matches("[href=\"#/".concat(filter, "\"]"))) {
                    el.classList.add("selected");
                }
                else {
                    el.classList.remove("selected");
                }
            });
        },
        displayCount: function (count) {
            replaceHTML(document.querySelector('[data-todo="count"]'), "\n\t\t\t\t<strong>".concat(count, "</strong>\n\t\t\t\t").concat(count === 1 ? "item" : "items", " left\n\t\t\t"));
        }
    },
    init: function () {
        Todos.addEventListener("save", App.render);
        App.filter = getURLHash();
        window.addEventListener("hashchange", function () {
            App.filter = getURLHash();
            App.render();
        });
        App.$.input.addEventListener("keyup", function (e) {
            if (e.key === "Enter" && e.target.value.length) {
                Todos.add({
                    title: e.target.value,
                    completed: false,
                    id: "id_" + Date.now()
                });
                App.$.input.value = "";
            }
        });
        App.$.toggleAll.addEventListener("click", function (e) {
            Todos.toggleAll();
        });
        App.$.clear.addEventListener("click", function (e) {
            Todos.clearCompleted();
        });
        App.bindTodoEvents();
        App.render();
    },
    todoEvent: function (event, selector, handler) {
        delegate(App.$.list, selector, event, function (e) {
            var $el = e.target.closest("[data-id]");
            handler(Todos.get($el.dataset.id), $el, e);
        });
    },
    bindTodoEvents: function () {
        App.todoEvent("click", '[data-todo="destroy"]', function (todo) { return Todos.remove(todo); });
        App.todoEvent("click", '[data-todo="toggle"]', function (todo) { return Todos.toggle(todo); });
        App.todoEvent("dblclick", '[data-todo="label"]', function (_, $li) {
            $li.classList.add("editing");
            $li.querySelector('[data-todo="edit"]').focus();
        });
        App.todoEvent("keyup", '[data-todo="edit"]', function (todo, $li, e) {
            var $input = $li.querySelector('[data-todo="edit"]');
            if (e.key === "Enter" && $input.value)
                Todos.update(__assign(__assign({}, todo), { title: $input.value }));
            if (e.key === "Escape") {
                $input.value = todo.title;
                App.render();
            }
        });
        App.todoEvent("focusout", '[data-todo="edit"]', function (todo, $li, e) {
            var title = $li.querySelector('[data-todo="edit"]').value;
            Todos.update(__assign(__assign({}, todo), { title: title }));
        });
    },
    createTodoItem: function (todo) {
        var li = document.createElement("li");
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add("completed");
        }
        insertHTML(li, "\n\t\t\t<div class=\"view\">\n\t\t\t\t<input data-todo=\"toggle\" class=\"toggle\" type=\"checkbox\" ".concat(todo.completed ? "checked" : "", ">\n\t\t\t\t<label data-todo=\"label\"></label>\n\t\t\t\t<button class=\"destroy\" data-todo=\"destroy\"></button>\n\t\t\t</div>\n\t\t\t<input class=\"edit\" data-todo=\"edit\">\n\t\t"));
        li.querySelector('[data-todo="label"]').textContent = todo.title;
        li.querySelector('[data-todo="edit"]').value = todo.title;
        return li;
    },
    render: function () {
        var _a;
        var count = Todos.all().length;
        App.$.setActiveFilter(App.filter);
        (_a = App.$.list).replaceChildren.apply(_a, Todos.all(App.filter).map(function (todo) { return App.createTodoItem(todo); }));
        App.$.showMain(count);
        App.$.showFooter(count);
        App.$.showClear(Todos.hasCompleted());
        App.$.toggleAll.checked = Todos.isAllCompleted();
        App.$.displayCount(Todos.all("active").length);
    }
};
App.init();
//# sourceMappingURL=app.js.map