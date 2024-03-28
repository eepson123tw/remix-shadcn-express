import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getTodo, updateTodo, createTodo } from "../data";
import { TodoCard } from "../components/todo-card";

import type { formData } from "~/utils/form";

const isCreate = (uuid: string) => uuid === "create";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const todo = await getTodo(params.uuId);
  try {
    if (todo.length || (params.uuId && isCreate(params.uuId))) {
      return json({ params, todo: todo[0] });
    }
  } catch (error) {
    console.log(error);
  }
  return redirect("/404");
};
export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.uuId, "Missing uuId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as Object as formData;

  try {
    if (params.uuId && isCreate(params.uuId)) {
      createTodo(updates);
    } else {
      await updateTodo(params.uuId, updates);
    }
  } catch (error) {
    console.log(error);
  }
  return redirect("/");
}

export default function ToDo() {
  const { params, todo } = useLoaderData<typeof loader>();
  const uuId = params.uuId;
  return <TodoCard uuId={uuId} todo={todo}></TodoCard>;
}
