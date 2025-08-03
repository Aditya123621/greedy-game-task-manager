"use client";

import { TextInput, Textarea, Button, ActionIcon } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import AddIcon from "@@/icons/add-icon.svg";
import CalenderIcon from "@@/icons/calender-icon.svg";
import { useRef } from "react";
import ClockIcon from "@@/icons/clock-icon.svg";
import { useCreateTodo } from "@/hooks/useCreateTodo";

interface TodoFormData {
  title: string;
  description: string;
  dueDate: string | null;
  dueTime: string | undefined;
}

export default function AddTodo() {
  const ref = useRef<HTMLInputElement>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      dueTime: "",
    },
  });
  const { mutate: createTodo, isPending: todoPending } = useCreateTodo();

  const onSubmit = (data: TodoFormData) => {
    console.log(data, "Datatatata");
    createTodo({
      title: data.title.trim(),
      description: data.description.trim(),
      dueDate: data.dueDate as string,
      dueTime: data.dueTime ?? "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-md mx-auto"
    >
      <Controller
        name="title"
        control={control}
        rules={{
          required: "Title is required",
          validate: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return "Title cannot be empty";
            if (trimmed.length > 100)
              return "Title cannot exceed 100 characters";
            return true;
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Title"
            withAsterisk
            placeholder="Enter Title"
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{
          required: "Description is required",
          validate: (value) => {
            const trimmed = value.trim();
            if (trimmed.length < 1)
              return "Description must have at least 1 character";
            if (trimmed.length > 700)
              return "Description cannot exceed 700 characters";
            return true;
          },
        }}
        render={({ field }) => (
          <Textarea
            {...field}
            label="Description"
            withAsterisk
            placeholder="Enter Description"
            rows={5}
            error={errors.description?.message}
          />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        rules={{
          required: "Due date is required",
          validate: (value, formValues) => {
            if (!value || !formValues.dueTime)
              return "Both date and time are required";

            const [hour, minute] = formValues.dueTime?.split(":");

            const dueDateTime = dayjs(value)
              .hour(Number(hour))
              .minute(Number(minute));

            if (dueDateTime.isBefore(dayjs())) {
              return "Due date and time must be in the future";
            }

            return true;
          },
        }}
        render={({ field }) => (
          <DateInput
            label="Due Date"
            placeholder="Choose Due Date"
            value={field.value}
            withAsterisk
            onChange={field.onChange}
            error={errors.dueDate?.message}
            leftSection={
              <ActionIcon variant="transparent">
                <CalenderIcon className="size-5" />
              </ActionIcon>
            }
            minDate={new Date()}
            leftSectionPointerEvents="none"
          />
        )}
      />

      <Controller
        name="dueTime"
        control={control}
        rules={{
          required: "Due time is required",
          validate: (value) => (value ? true : "Due time is required"),
        }}
        render={({ field }) => (
          <TimeInput
            {...field}
            label="Due Time"
            placeholder="Choose Due Time"
            withAsterisk
            error={errors.dueTime?.message}
            value={field.value}
            onChange={(val) => field.onChange(val)}
            leftSection={
              <ActionIcon
                variant="transparent"
                onClick={() => ref.current?.showPicker()}
              >
                <ClockIcon className="size-5" />
              </ActionIcon>
            }
          />
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          leftSection={<AddIcon className="size-3" />}
          loading={todoPending}
        >
          Create Todo
        </Button>
      </div>
    </form>
  );
}
