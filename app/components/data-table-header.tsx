import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { type Table, type ColumnDef } from "@tanstack/react-table";

import { Form, useSubmit, useNavigation, useNavigate } from "@remix-run/react";
import { useState, useContext } from "react";
import { TableContext } from "../store/tableContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: Table<TData>;
}

const DataTableHeader = <TData, TValue>({
  table,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columns,
}: DataTableProps<TData, TValue>) => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const tableContext = useContext(TableContext);
  const [query, setQuery] = useState(tableContext?.query || "");

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  return (
    <div className="flex w-full">
      <div className="flex items-center w-full ">
        <Form
          className="flex w-full "
          id="search-form"
          role="search"
          onChange={(event) => {
            submit(event.currentTarget);
          }}
        >
          <Input
            aria-label="Search contacts"
            className={`${searching ? "loading" : ""}`}
            id="q"
            name="q"
            // synchronize user's input to component state
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search"
            type="search"
            // switched to `value` from `defaultValue`
            value={query}
          />
        </Form>
        <Form method="get">
          <Button
            type="button"
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 mx-4"
            onClick={() => navigate("/todo/create")}
          >
            Create
          </Button>
        </Form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Toggle columns"
            variant="outline"
            className="ml-auto hidden lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 size-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableHeader;
