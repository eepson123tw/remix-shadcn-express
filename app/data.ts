////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

export type todoItem = {
  title: string;
  description: string;
  isCompleted?: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
};

export type uuIdTodoItem = todoItem & {
  uuId?: string;
  createdAt: string;
  updatedAt?: string;
};

const uuIdV1 = () => {
  return "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
};

const getId = (uuid: string): string => {
  let id: string = "";
  for (const key in fakeTodo.todoList) {
    if (fakeTodo.todoList[key].uuId === uuid) {
      id = key;
    }
  }
  return id;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeTodo = {
  todoList: {} as Record<string, uuIdTodoItem>,
  async getAll(): Promise<uuIdTodoItem[]> {
    return Object.keys(fakeTodo.todoList)
      .map((key) => fakeTodo.todoList[key])
      .sort(sortBy("-createdAt", "last"));
  },
  async get(uuid: string): Promise<uuIdTodoItem | null> {
    const id = getId(uuid);
    return fakeTodo.todoList[id] || null;
  },
  async create(values: todoItem): Promise<uuIdTodoItem> {
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = {
      uuId: uuIdV1(),
      createdAt,
      updatedAt: createdAt,
      ...values,
    };
    fakeTodo.todoList[id] = newContact;
    return newContact;
  },
  async set(uuid: string, values: uuIdTodoItem): Promise<uuIdTodoItem> {
    const id = getId(uuid);
    const todo = await fakeTodo.get(uuid);
    invariant(todo, `No contact found for ${id}, set Error`);
    const updatedContact = { ...todo, ...values };
    fakeTodo.todoList[id] = updatedContact;
    return updatedContact;
  },
  // destroy(id: string): null {
  //   delete fakeContacts.records[id];
  //   return null;
  // },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getTodo(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let todoList = await fakeTodo.getAll();
  if (query) {
    todoList = matchSorter(todoList, query, {
      keys: ["title", "description", "uuId"],
    });
  }
  return todoList.sort(sortBy("last", "createdAt"));
}

export async function createTodo(todoItem: todoItem) {
  const contact = await fakeTodo.create(todoItem);
  return contact;
}

// export async function getTodoItem(id: string) {
//   return fakeTodo.get(id);
// }

export async function updateTodo(id: string, updates: object) {
  const contact = await fakeTodo.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id} updateTodo Error`);
    redirect("/");
  }
  await fakeTodo.set(id, { ...contact, ...updates });
  return contact;
}

// export async function deleteContact(id: string) {
//   fakeContacts.destroy(id);
// }

const base: todoItem[] = [
  {
    title: "Grocery Shopping",
    description: "Buy groceries for the week",
    isCompleted: false,
    dueDate: "2024-02-24",
    priority: "medium",
    tags: ["groceries", "weekly"],
  },
  {
    title: "Finish Book Chapter",
    description: "ark",
    isCompleted: false,
    dueDate: "2024-02-25",
    priority: "low",
    tags: ["reading", "personal development"],
  },
  {
    title: "Prepare Presentation",
    description: "Prepare the monthly review presentation",
    isCompleted: false,
    dueDate: "2024-02-29",
    priority: "high",
    tags: ["work", "urgent"],
  },
];

base.forEach((todoItem) => {
  fakeTodo.create(todoItem);
});
