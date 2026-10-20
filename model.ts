
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

// 1. Add a new task with a unique ID.
export function addTask(tasks: Task[], title: string): Task[] {
  const nextId =
    tasks.length === 0
      ? 1
      : Math.max(...tasks.map((task) => task.id)) + 1;

  const newTask: Task = {
    id: nextId,
    title: title,
    status: "todo",
  };

  return [...tasks, newTask];
}

// 2. Mark the task with the matching ID as done.
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id
      ? { ...task, status: "done" }
      : task
  );
}

// 3. Return only tasks with the requested status.
export function filterByStatus(
  tasks: Task[],
  status: TaskStatus
): Task[] {
  return tasks.filter((task) => task.status === status);
}

// 4. Extra operation: advance a task to the next status.
export function advanceTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    const nextStatus: TaskStatus =
      task.status === "todo"
        ? "in-progress"
        : task.status === "in-progress"
          ? "done"
          : "done";

    return { ...task, status: nextStatus };
  });
}






const tasks: Task[] = [];

const first = addTask(tasks, "Learn TypeScript");
const second = addTask(first, "Build the task tracker");

const inProgress = advanceTask(second, 1);
const completed = completeTask(inProgress, 2);

const todoTasks = filterByStatus(completed, "todo");
const finishedTasks = filterByStatus(completed, "done");

console.log(completed);
console.log(todoTasks);
console.log(finishedTasks);