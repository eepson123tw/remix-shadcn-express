"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { useNavigate } from "@remix-run/react";

import type { DataTableFilterField } from "~/types";
import type { todoItem } from "../data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterFields: DataTableFilterField<any>[] = [
  {
    label: "Title",
    value: "title",
    placeholder: "Filter titles...",
  },
  {
    label: "Priority",
    value: "priority",
  },
];

export function getColumns(): ColumnDef<todoItem>[] {
  return [
    {
      id: "isCompleted",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-center justify-center "
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            Done
          </Button>
        );
      },
      cell: ({ row }) => (
        <Checkbox
          className="ml-6"
          defaultChecked={Boolean(row.original.isCompleted)}
          disabled
          aria-label="Completed row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      sortingFn: (rowA, rowB) => {
        const value = (A: number): number => {
          return A === 0 ? 1 : 2;
        };
        const Anum = value(rowA.original.isCompleted);
        const Bnum = value(rowB.original.isCompleted);
        if (Anum === Bnum) return 0;
        return Anum < Bnum ? 1 : -1;
      },
    },
    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("title")}</div>
      ),
      accessorKey: "title",
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "dueDate",
      header: "DueDate",
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const title = row.getValue("priority") as string;
        const priority =
          title === "high"
            ? "bg-red-500"
            : title === "medium"
            ? "bg-orange-400"
            : "bg-green-400";
        return (
          <Badge className={priority} variant="destructive">
            {title}
          </Badge>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const todoItem = row.original;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  todoItem?.uuId &&
                    navigator.clipboard.writeText(todoItem.uuId);
                }}
              >
                Copy todo uuId
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/todo/${todoItem?.uuId}`);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-300  focus:text-red-500 cursor-pointer"
                onClick={() => {
                  fetch(
                    window.process.env + `/todo-api?deleteId=${todoItem.uuId}`,
                    {
                      method: "DELETE",
                    }
                  ).then(() => {
                    window.location.reload();
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
