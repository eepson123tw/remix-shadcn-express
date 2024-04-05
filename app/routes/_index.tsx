import type {
  MetaFunction,
  // LinksFunction,
  // ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";

import { getTodo } from "../data";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  // Form,
  // useSubmit,
  // useNavigation,
  useLocation,
  useSearchParams,
  useNavigate,
  // useNavigate,
  // useActionData,
} from "@remix-run/react";

import { TableContext } from "../store/tableContext";
import { DataTable } from "../components/search-table";
import { getColumns, filterFields } from "../components/columns";
import { useEffect, useMemo } from "react";
import { useCreateQueryString } from "~/hooks/useCreateQueryString";

export const meta: MetaFunction = () => {
  return [
    { title: "TodoList" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const page = url.searchParams.get("page");
  const perPages = url.searchParams.get("per_page");

  const response = await fetch(
    process.env.API_PATH +
      `/sqlite/todo?q=${q}&page=${page}&per_page=${perPages}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const {
    items, // 当前页的数据
    page: currentPage,
    perPage,
    // total, // 总记录数
    // totalPages, // 总页数
    // sort,
  } = await response.json();

  const todoList = await getTodo(items, q);
  redirect("/1231231");

  // console.log({ page, perPages });
  // console.log({ perPage, currentPage, items, todoList });
  return json({ todoList, q, currentPage, perPage });
};

export default function Index() {
  const { todoList, q, currentPage, perPage } = useLoaderData<typeof loader>();
  const columns = useMemo(() => getColumns(), []);
  const [searchParams] = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    search === "" &&
      navigate(
        `${pathname}?${createQueryString({
          page: currentPage,
          per_page: perPage,
        })}`
      );
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <TableContext.Provider value={{ query: q }}>
        <DataTable
          columns={columns}
          data={todoList}
          curPage={currentPage}
          pageCount={perPage}
          filterFields={filterFields}
        />
      </TableContext.Provider>
    </div>
  );
}
