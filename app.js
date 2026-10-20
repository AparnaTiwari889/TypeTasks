import { addTask, advanceTask, completeTask, filterByStatus, } from "./model.js";
let tasks = [];
let currentFilter = "all";
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const progressCount = document.getElementById("progress-count");
const doneCount = document.getElementById("done-count");
const visibleCount = document.getElementById("visible-count");
const formMessage = document.getElementById("form-message");
const filterButtons = document.querySelectorAll("[data-filter]");
function getVisibleTasks() {
    if (currentFilter === "all") {
        return tasks;
    }
    return filterByStatus(tasks, currentFilter);
}
function renderTasks() {
    taskList.replaceChildren();
    const visibleTasks = getVisibleTasks();
    visibleCount.textContent =
        `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;
    totalCount.textContent = String(tasks.length);
    progressCount.textContent = String(filterByStatus(tasks, "in-progress").length);
    doneCount.textContent = String(filterByStatus(tasks, "done").length);
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    if (visibleTasks.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state";
        emptyItem.textContent =
            tasks.length === 0
                ? "Your task list is empty. Add your first task above!"
                : "No tasks match this filter. Try another status.";
        taskList.append(emptyItem);
        return;
    }
    visibleTasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = "task-item";
        const info = document.createElement("div");
        info.className = "task-info";
        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;
        const meta = document.createElement("div");
        meta.className = "task-meta";
        const idLabel = document.createElement("span");
        idLabel.className = "task-id";
        idLabel.textContent = `TASK-${task.id}`;
        const badge = document.createElement("span");
        badge.className = `status-badge status-${task.status}`;
        badge.textContent =
            task.status === "todo"
                ? "TO DO"
                : task.status === "in-progress"
                    ? "IN PROGRESS"
                    : "DONE";
        meta.append(idLabel, badge);
        info.append(title, meta);
        const advanceButton = document.createElement("button");
        advanceButton.type = "button";
        advanceButton.className = "advance-button";
        if (task.status === "done") {
            advanceButton.textContent = "Completed ✓";
            advanceButton.disabled = true;
        }
        else {
            advanceButton.textContent =
                task.status === "todo" ? "Start →" : "Complete ✓";
            advanceButton.setAttribute("aria-label", `${task.status === "todo" ? "Start" : "Complete"} ${task.title}`);
            advanceButton.addEventListener("click", () => {
                tasks = advanceTask(tasks, task.id);
                renderTasks();
            });
        }
        item.append(info, advanceButton);
        taskList.append(item);
    });
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
        formMessage.textContent = "Please enter a task title.";
        titleInput.focus();
        return;
    }
    tasks = addTask(tasks, title);
    currentFilter = "all";
    formMessage.textContent = "";
    form.reset();
    titleInput.focus();
    renderTasks();
});
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;
        if (selectedFilter === "all" ||
            selectedFilter === "todo" ||
            selectedFilter === "in-progress" ||
            selectedFilter === "done") {
            currentFilter = selectedFilter;
            renderTasks();
        }
    });
});
// Keep the Part 1 completeTask operation connected and available.
function markTaskComplete(id) {
    tasks = completeTask(tasks, id);
    renderTasks();
}
renderTasks();
