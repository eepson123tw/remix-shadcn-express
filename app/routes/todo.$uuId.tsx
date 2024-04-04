import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getTodoItem, updateTodo } from "../data";
import { TodoCard } from "../components/todo-card";

import type { formData } from "~/utils/form";

const isCreate = (uuid: string) => uuid === "create";

export async function loader({ params }: LoaderFunctionArgs) {
  const todo = await getTodoItem(params.uuId as string);

  try {
    if (params.uuId || isCreate(params.uuId as string)) {
      return json({ params, todo });
    }
  } catch (error) {
    console.log(error);
  }
  return redirect("/404");
}
export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.uuId, "Missing uuId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData) as unknown as formData;

  try {
    if (params.uuId && isCreate(params.uuId)) {
      const response = await fetch(process.env.LOCAL_PATH + "/todo-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.error) {
        return redirect("/404");
      }
      redirect("/");
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
