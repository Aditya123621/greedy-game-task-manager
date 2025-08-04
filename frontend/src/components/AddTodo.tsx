"use client";

import { TextInput, Textarea, Button, ActionIcon, Select } from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import AddIcon from "@@/icons/add-icon.svg";
import CalenderIcon from "@@/icons/calender-icon.svg";
import { useEffect, useRef } from "react";
import ClockIcon from "@@/icons/clock-icon.svg";
import { useCreateTodo, useGetTodoById, useUpdateTodo } from "@/hooks/useTodos";
import EditIcon from "@@/icons/edit-icon-2.svg";

interface TodoFormData {
  title: string;
  description: string;
  dueDate: string | null;
  dueTime: string | undefined;
  status: string;
}

export default function AddTodo({ data }: { data: { id: string } }) {
  const { data: todoData } = useGetTodoById(data?.id);
  const { mutate: updateTodo } = useUpdateTodo();
  const ref = useRef<HTMLInputElement>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<TodoFormData>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      dueTime: "",
      status: "",
    },
  });
  const { mutate: createTodo, isPending: todoPending } = useCreateTodo();

  const onSubmit = (formData: TodoFormData) => {
    if (data?.id) {
      updateTodo({
        id: data.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate as string,
        dueTime: formData.dueTime ?? "",
        status: formData.status,
      });
    } else {
      createTodo({
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate as string,
        dueTime: formData.dueTime ?? "",
      });
    }
  };

  useEffect(() => {
    if (todoData) {
      const { title, description, dueDate, dueTime, status } = todoData;
      reset({ description, title, dueTime, dueDate, status });
    }
  }, [reset, todoData]);

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
      {todoData?.status !== "Completed" && (
        <>
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
        </>
      )}

      <div className={!data?.id ? "hidden" : ""}>
        <Controller
          name="status"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Select
              {...field}
              label="Select Status"
              placeholder="Select Status"
              allowDeselect={false}
              data={["Upcoming", "Completed"]}
              disabled={todoData?.status === "Completed"}
            />
          )}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          leftSection={
            data?.id ? (
              <EditIcon className="size-3 text-white" />
            ) : (
              <AddIcon className="size-3" />
            )
          }
          loading={todoPending}
        >
          {data?.id ? "Edit Todo" : "Create Todo"}
        </Button>
      </div>
    </form>
  );
}
