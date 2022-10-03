var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
export var TodoStore = (function (_super) {
    __extends(class_1, _super);
    function class_1(localStorageKey) {
        var _this = _super.call(this) || this;
        _this.get = function (id) { return _this.todos.find(function (todo) { return todo.id === id; }); };
        _this.isAllCompleted = function () { return _this.todos.every(function (todo) { return todo.completed; }); };
        _this.hasCompleted = function () { return _this.todos.some(function (todo) { return todo.completed; }); };
        _this.all = function (filter) {
            return filter === "active"
                ? _this.todos.filter(function (todo) { return !todo.completed; })
                : filter === "completed"
                    ? _this.todos.filter(function (todo) { return todo.completed; })
                    : _this.todos;
        };
        _this.localStorageKey = localStorageKey;
        _this._readStorage();
        window.addEventListener("storage", function () {
            _this._readStorage();
            _this._save();
        }, false);
        return _this;
    }
    class_1.prototype._readStorage = function () {
        this.todos = JSON.parse(window.localStorage.getItem(this.localStorageKey) || "[]");
    };
    class_1.prototype._save = function () {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
        this.dispatchEvent(new CustomEvent("save"));
    };
    class_1.prototype.add = function (todo) {
        this.todos.push({
            title: todo.title,
            completed: false,
            id: "id_" + Date.now()
        });
        this._save();
    };
    class_1.prototype.remove = function (_a) {
        var id = _a.id;
        this.todos = this.todos.filter(function (todo) { return todo.id !== id; });
        this._save();
    };
    class_1.prototype.toggle = function (_a) {
        var id = _a.id;
        this.todos = this.todos.map(function (todo) {
            return todo.id === id ? __assign(__assign({}, todo), { completed: !todo.completed }) : todo;
        });
        this._save();
    };
    class_1.prototype.clearCompleted = function () {
        this.todos = this.todos.filter(function (todo) { return !todo.completed; });
        this._save();
    };
    class_1.prototype.update = function (todo) {
        this.todos = this.todos.map(function (t) { return (t.id === todo.id ? todo : t); });
        this._save();
    };
    class_1.prototype.toggleAll = function () {
        var completed = !this.hasCompleted() || !this.isAllCompleted();
        this.todos = this.todos.map(function (todo) { return (__assign(__assign({}, todo), { completed: completed })); });
        this._save();
    };
    class_1.prototype.revert = function () {
        this._save();
    };
    return class_1;
}(EventTarget));
//# sourceMappingURL=store.js.map