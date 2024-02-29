import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getTodo, updateTodo } from "../data";
import { TodoCard } from "../components/todo-card";
// existing imports

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const todo = await getTodo(params.uuId);
  // return json({ contact });
  return json({ params, todo: todo[0] });
};
export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.uuId, "Missing uuId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateTodo(params.uuId, updates);
  return redirect("/");
}

export default function ToDo() {
  const { params, todo } = useLoaderData<typeof loader>();
  const uuId = params.uuId;
  // existing code
  return <TodoCard uuId={uuId} todo={todo}></TodoCard>;
}

// existing code
