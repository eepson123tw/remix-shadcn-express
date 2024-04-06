"use client";

import { useForm } from "react-hook-form";
import { useSubmit, useNavigate, Form } from "@remix-run/react";
import { ajvResolver } from "@hookform/resolvers/ajv";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { formData } from "~/utils/form";
import { schema } from "~/utils/form";
import { useState } from "react";

type CardProps = React.ComponentProps<typeof Card>;

export function TodoCard({ className, ...props }: CardProps) {
  const { todo, uuId } = props;
  const isCreate = uuId === "create";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    mode: "onChange",
    resolver: ajvResolver(schema),
    defaultValues: {
      isCompleted: todo?.isCompleted ? true : false,
    },
  });

  const navigate = useNavigate();
  const submit = useSubmit();

  const [priority, setPriority] = useState(todo?.priority || "");

  const onSubmit = (formData: formData) => {
    submit({ ...formData, priority }, { method: "put" });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {isCreate
            ? "Create Todo"
            : `Edit ID: ${props.uuId?.toLocaleUpperCase()}`}
        </CardTitle>
        <CardDescription>
          {isCreate
            ? "Create your new Todo in one-click."
            : "Edit your Todo and gogo!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          method="post"
          id="todo-form"
          onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title of your Todo"
                defaultValue={todo?.title}
                {...register("title")}
              />
              <p className="text-red-700">
                {errors?.title && errors?.title.message}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="give me your description"
                defaultValue={todo?.description}
                {...register("description")}
              />
              <p className="text-red-700">
                {errors?.description && errors?.description.message}
              </p>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="isCompleted"
                className="mr-1"
                value={todo?.isCompleted ? "true" : "false"}
                defaultChecked={todo?.isCompleted ? true : false}
                {...register("isCompleted")}
              />
              <Label
                htmlFor="isCompleted"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
              >
                Are u completed?
              </Label>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select
                defaultValue={priority}
                onValueChange={(value) => setPriority(value)}
                {...register("priority")}
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder={todo?.priority || ""} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">low</SelectItem>
                  <SelectItem value="medium">medium</SelectItem>
                  <SelectItem value="high">high</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                type="text"
                placeholder="Title of your Todo"
                defaultValue={todo?.tags}
                {...register("tags")}
              />
              <p className="text-red-700">
                {errors?.title && errors?.title.message}
              </p>
            </div>
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button
          form="todo-form"
          className={isCreate ? "bg-green-400" : "bg-blue-400"}
          type="submit"
          value="submit"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isCreate ? "Create" : "Edit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
