"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useSubmit } from "@remix-run/react";
import { ajvResolver } from "@hookform/resolvers/ajv";
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

import type { formData } from "~/utils/form";
import formValidate, { schema } from "~/utils/form";

type CardProps = React.ComponentProps<typeof Card>;

export function TodoCard({ className, ...props }: CardProps) {
  const { todo, uuId } = props;
  const isCreate = uuId === "create";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({
    mode: "onChange",
    resolver: ajvResolver(schema),
    defaultValues: {
      isCompleted: todo?.isCompleted ? true : false,
    },
  });

  const submit = useSubmit();
  const onSubmit = (formData: formData) => {
    console.log(`You said: ${JSON.stringify(formData, null, 4)}`);
    submit(formData, { method: "post" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCreate ? "Create Todo" : props.uuId?.toLocaleUpperCase()}
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
              <p>{errors?.title && errors?.title.message}</p>
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
              <p>{errors?.description && errors?.description.message}</p>
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
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
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
