import { json, redirect } from "@remix-run/node";

import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  switch (request.method) {
    case "POST": {
      const res = await fetch(process.env.API_PATH + "/sqlite/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: request.body,
      });

      const data = await res.json();

      if (data.error) {
        return redirect("/404");
      }
      redirect("/");
      return json(data);
    }
    case "PUT": {
      const editId = request.url.split("?editId=")[1];
      const res = await fetch(process.env.API_PATH + `/sqlite/todo/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: request.body,
      });
      const data = await res.json();
      if (data.error) {
        return redirect("/404");
      }
      return json(data);
    }
    case "DELETE": {
      const deleteId = request.url.split("?deleteId=")[1];
      const res = await fetch(
        process.env.API_PATH + `/sqlite/todo/${deleteId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.error) {
        return redirect("/404");
      }
      return json(data);
    }
  }
  redirect("/404");
}
