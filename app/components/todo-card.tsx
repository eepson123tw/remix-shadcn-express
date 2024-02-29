"use client";

import { Form } from "@remix-run/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

export function TodoCard({ className, ...props }: CardProps) {
  const { todo, uuId } = props;
  const isCreate = uuId === "create";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {" "}
          {isCreate ? "Create Todo" : props.uuId?.toLocaleUpperCase()}
        </CardTitle>
        <CardDescription>
          {isCreate
            ? "Create your new Todo in one-click."
            : "Edit your Todo and gogo!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form id="todo-form" method="post">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Title of your Todo"
                defaultValue={todo?.title}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="give me your description"
                defaultValue={todo?.description}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                id="isCompleted"
                className="mr-1"
                name="isCompleted"
                value="true"
                defaultChecked={todo?.isCompleted ? true : false}
              />
              <Label
                htmlFor="isCompleted"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
              >
                Are u completed?
              </Label>
            </div>
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button
          form="todo-form"
          className={isCreate ? "bg-green-400" : "bg-blue-400"}
          type="submit"
        >
          {isCreate ? "Create" : "Edit"}
        </Button>
      </CardFooter>
    </Card>
  );
}

/*
    title: "Grocery Shopping",
    description: "Buy groceries for the week",
    isCompleted: false,
    dueDate: "2024-02-24",
    priority: "medium",
    tags: ["groceries", "weekly"],
    createdAt: string;
    updatedAt?: string;
*/
