import { useDeleteTodo, useGetTodoById } from "@/hooks/useTodos";
import { getStatusStyle } from "@/utils/getBadgeColor";
import CalenderIcon from "@@/icons/calender-icon.svg";
import FlagIcon from "@@/icons/flag-icon.svg";
import { ActionIcon, Badge } from "@mantine/core";
import dayjs from "dayjs";
import EditIcon from "@@/icons/edit-icon-2.svg";
import DeleteIcon from "@@/icons/delete-icon.svg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useQueryClient } from "@tanstack/react-query";

const TodoDetail = ({ data }: { data: { id: string } }) => {
  const { mutate: deleteTodo } = useDeleteTodo();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const { data: todoData } = useGetTodoById(data?.id);

  return (
    <div className="bg-white p-3 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-custom-primary-black break-all">
        {todoData?.title}
      </h1>
      <div className="grid grid-cols-12">
        <div className="flex items-center space-x-2 min-w-0 col-span-4">
          <CalenderIcon className="size-5" />
          <span className="text-sm font-medium text-gray-600">Due Date</span>
        </div>
        <div className="text-sm text-custom-primary-black col-span-8">
          {dayjs(todoData?.dueDate).format("DD/MM/YYYY")} {todoData?.dueTime}
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="flex items-center space-x-2 min-w-0 col-span-4">
          <FlagIcon className="size-5" />
          <span className="text-sm font-medium text-gray-600">Status</span>
        </div>
        {todoData?.status &&
          (() => {
            const status = todoData.status.toLowerCase();
            const { label, text, bg } = getStatusStyle(status);

            return (
              <Badge
                size="lg"
                color={bg}
                classNames={{
                  label: `${text} !font-normal`,
                  root: "!normal-case !col-span-8",
                }}
              >
                {label}
              </Badge>
            );
          })()}
      </div>

      <div className="flex gap-3">
        <ActionIcon
          variant="transparent"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["todo", data?.id] });
            dispatch(openDrawer({ type: "add_todo", data: { id: data?.id } }));
          }}
        >
          <EditIcon className="size-6 text-[#657081]" />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          onClick={() => {
            deleteTodo(data.id);
          }}
        >
          <DeleteIcon className="size-6 text-[#657081]" />
        </ActionIcon>
      </div>
      <hr className="text-[#E9EAEC]" />

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-custom-primary-black">
          Description
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed break-all">
          {todoData?.description}
        </p>
      </div>
    </div>
  );
};

export default TodoDetail;
