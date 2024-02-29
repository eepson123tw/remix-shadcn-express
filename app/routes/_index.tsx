import type {
  MetaFunction,
  // LinksFunction,
  // ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { getTodo } from "../data";
import {
  json,
  // redirect
} from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useSubmit,
  useNavigation,
  useNavigate,
  // useActionData,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/search-table";
import { columns } from "../components/columns";

export const meta: MetaFunction = () => {
  return [
    { title: "TodoList" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const todoList = await getTodo(q);
  return json({ todoList, q });
};

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const q = String(formData.get("q"));
//   const errors: { [key: string]: string } = {};

//   if (!q) {
//     errors.q = "WWWWWWW";
//   }

//   if (Object.keys(errors).length > 0) {
//     return json({ errors });
//   }
//   // Redirect to dashboard if validation is successful
//   return redirect(`/todo/${q}`);
// }
export default function Index() {
  const { todoList, q } = useLoaderData<typeof loader>();
  // const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [query, setQuery] = useState(q || "");
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex w-full  items-center space-x-2">
        <Form
          className="w-full flex"
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
        >
          <Input
            aria-label="Search contacts"
            className={`${searching ? "loading" : ""} `}
            id="q"
            name="q"
            // synchronize user's input to component state
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search"
            type="search"
            // switched to `value` from `defaultValue`
            value={query}
          />
          {/* {actionData?.errors?.q ? <em>{actionData?.errors.q}</em> : null} */}
          {/* <div id="search-spinner" hidden={!searching} aria-hidden /> */}
        </Form>
        <Form method="get">
          <Button
            type="button"
            className="bg-green-500 hover:bg-green-600 active:bg-green-700"
            onClick={() => navigate("/todo/create")}
          >
            Create
          </Button>
        </Form>
      </div>
      <DataTable columns={columns} data={todoList} />
    </div>
  );
}
