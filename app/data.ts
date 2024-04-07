////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
//    and some helper functions to simulate a real database.
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";
import { redirect } from "@remix-run/node";

export type todoItem = {
  uuId: string;
  title: string;
  description: string;
  isCompleted: number;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
};

export type uuIdTodoItem = todoItem & {
  uuId?: string;
  createdAt: string;
  updatedAt?: string;
};

// const uuIdV1 = () => {
//   return "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
//     const r = Math.floor(Math.random() * 16);
//     return r.toString(16);
//   });
// };

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
  todoList: {} as Record<string, todoItem>,
  async getAll(): Promise<todoItem[]> {
    return Object.keys(fakeTodo.todoList)
      .map((key) => fakeTodo.todoList[key])
      .sort(sortBy("-createdAt", "last"));
  },
  async get(uuId: string): Promise<todoItem | null> {
    return fakeTodo.todoList[uuId] || null;
  },
  async create(values: todoItem): Promise<todoItem> {
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = {
      createdAt,
      updatedAt: createdAt,
      ...values,
    };
    fakeTodo.todoList[id] = newContact;
    return newContact;
  },
  async set(uuId: string, values: todoItem): Promise<todoItem> {
    const id = getId(uuId);
    const todo = await fakeTodo.get(uuId);
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
export async function getTodo(data?: todoItem[], query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  let todoList = data ? data : await fakeTodo.getAll();
  if (data) {
    fakeTodo.todoList = data.reduce((acc, item) => {
      acc[item.uuId] = item;
      return acc;
    }, {} as Record<string, todoItem>);
  }
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

export async function getTodoItem(uuId: string) {
  return fakeTodo.get(uuId);
}

export async function updateTodo(id: string, updates: object) {
  const contact = await fakeTodo.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id} updateTodo Error`);
    redirect("/");
  }
  await fakeTodo.set(id, { ...contact, ...updates });
  return contact;
}
