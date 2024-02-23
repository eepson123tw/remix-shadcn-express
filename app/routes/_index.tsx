import type {
  MetaFunction,
  // LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { getTodo } from "../data";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useSubmit,
  useNavigation,
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

export default function Index() {
  const { todoList, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
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
          className="w-full"
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
        >
          <Input
            aria-label="Search contacts"
            className={searching ? "loading" : ""}
            id="q"
            name="q"
            // synchronize user's input to component state
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search"
            type="search"
            // switched to `value` from `defaultValue`
            value={query}
          />
          {/* <div id="search-spinner" hidden={!searching} aria-hidden /> */}
        </Form>
        <Form method="post">
          <Button type="submit">Search</Button>
        </Form>
      </div>
      <DataTable columns={columns} data={todoList} />
    </div>
  );
}
