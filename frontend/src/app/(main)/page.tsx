"use client";

import { Button, Skeleton, Badge, ActionIcon } from "@mantine/core";
import React, { useMemo, useState, useEffect } from "react";
import FilterIcon from "@@/icons/filter-icon.svg";
import AddIcon from "@@/icons/add-icon.svg";
import EditIcon from "@@/icons/edit-icon-2.svg";
import DeleteIcon from "@@/icons/delete-icon.svg";
import {
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDeleteTodo, useGetListQuery } from "@/hooks/useTodos";
import { TodoItem } from "@/types/todo";
import { TruncateAndProvideTooltip } from "@/components/TruncateAndProvideTooltip";
import { useGetUserInfo } from "@/hooks/useUserProfile";
import dayjs from "dayjs";
import { getStatusStyle } from "@/utils/getBadgeColor";
import { useQueryClient } from "@tanstack/react-query";
import { setStats } from "@/store/slices/todoSlice";
import TanStackReusableTable, {
  createSortableHeader,
} from "@/components/TanStackReusableTable";
import { SectionToolbar } from "@/components/SectionToolbar";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();
  const dispatch = useDispatch<AppDispatch>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const search = useSelector((state: RootState) => state.todo.search);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "dueDate",
    sortOrder: "asc",
  });
  const { mutate: deleteTodo } = useDeleteTodo();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetListQuery(filters);

  const todos = useMemo(
    () => (data ? data.pages.flatMap((page) => page.todos) : []),
    [data]
  );

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search }));
  }, [search]);

  useEffect(() => {
    const stats = data?.pages?.[0]?.stats;
    if (stats) {
      dispatch(
        setStats({
          total: stats.total,
          upcoming: stats.upcoming,
          completed: stats.completed,
        })
      );
    }
  }, [data, dispatch]);

  const columnHelper = createColumnHelper<TodoItem>();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("title", {
          header: "Todo",
          size: 300,
          cell: (info) => (
            <div className="">
              <TruncateAndProvideTooltip
                text={info.getValue()}
                className="font-medium text-custom-primary-black "
              />
              <TruncateAndProvideTooltip
                text={info.row.original.description}
                className="text-sm text-[#989FAB] "
              />
            </div>
          ),
        }),
        columnHelper.accessor("dueDate", {
          header: createSortableHeader("Due Date"),
          size: 150,
          enableSorting: true,
          cell: (info) => (
            <div className="max-w-xs">
              <TruncateAndProvideTooltip
                text={dayjs(info.getValue()).format("DD/MM/YYYY")}
                className=" text-[#071631] "
              />
              <TruncateAndProvideTooltip
                text={info.row.original.dueTime}
                className=" text-[#071631] "
              />
            </div>
          ),
        }),
        columnHelper.accessor("status", {
          header: createSortableHeader("Status"),
          size: 120,
          enableSorting: true,
          cell: (info) => {
            const status = info.getValue().toLocaleLowerCase();
            const { label, text, bg } = getStatusStyle(status);
            return (
              <Badge
                size="lg"
                color={bg}
                classNames={{
                  label: `${text} !font-normal`,
                  root: "!normal-case",
                }}
              >
                {label}
              </Badge>
            );
          },
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          size: 100,
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <ActionIcon
                color="#F4EFFF"
                onClick={() => {
                  const todoId = row.original._id;
                  queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
                  dispatch(
                    openDrawer({
                      type: "todo_detail",
                      data: { id: todoId },
                    })
                  );
                }}
              >
                <EditIcon className="size-4 text-[#8C62FF]" />
              </ActionIcon>
              <ActionIcon
                color="#FEE9F1"
                onClick={() => {
                  deleteTodo(row.original._id);
                }}
              >
                <DeleteIcon className="size-4 text-[#F44E8B]" />
              </ActionIcon>
            </div>
          ),
        }),
      ] as ColumnDef<TodoItem>[],
    [columnHelper, queryClient, dispatch, deleteTodo]
  );

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    const sort = newSorting[0];
    setFilters((prev) => ({
      ...prev,
      sortBy: sort?.id || "dueDate",
      sortOrder: sort?.desc ? "desc" : "asc",
    }));
  };

  const statusFilters = [
    { label: "Completed", value: "Completed", color: "green" },
    { label: "Upcoming", value: "Upcoming", color: "yellow" },
    { label: "Clear", value: "", color: "gray" },
  ];

  return (
    <div className="bg-[#FAFAFA] p-10 flex flex-col gap-6 flex-auto">
      {!userInfo?.name ? (
        <Skeleton height={32} width={200} radius="sm" />
      ) : (
        <TruncateAndProvideTooltip
          text={`Hello, ${userInfo.name}`}
          className="text-[#111827] font-bold text-2xl"
        />
      )}

      <div className="bg-white py-4 !rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 xl:grid-cols-5 divide-x divide-gray-200">
          {isLoading
            ? [1, 2, 3].map((_, idx) => (
                <div key={idx} className="bg-white px-6 py-2 space-y-2">
                  <Skeleton height={16} width={80} radius="sm" />
                  <Skeleton height={32} width={60} radius="sm" />
                </div>
              ))
            : [
                {
                  label: "All Todos",
                  count: data?.pages[0]?.stats?.total ?? 0,
                },
                {
                  label: "Upcoming",
                  count: data?.pages[0]?.stats?.upcoming ?? 0,
                },
                {
                  label: "Completed",
                  count: data?.pages[0]?.stats?.completed ?? 0,
                },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white px-6 py-2">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-3xl font-semibold text-custom-primary-black">
                    {stat.count}
                  </p>
                </div>
              ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex-auto flex flex-col">
        <SectionToolbar
          title="All Todos"
          secondaryButton={{
            label: "Filter",
            icon: <FilterIcon className="size-5" />,
            classNames: { label: "!text-[#6A7383]", inner: "!px-4" },
            dropdownContent: (
              <div className="flex flex-col gap-3 p-2">
                <h1 className="text-sm font-semibold">Filter By Status:</h1>
                <div className="flex gap-2">
                  {statusFilters.map((filter) => (
                    <Button
                      key={filter.label}
                      size="lg"
                      variant={
                        filters.status === filter.value ? "filled" : "light"
                      }
                      color={filter.color}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          status: filter.value,
                        }))
                      }
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            ),
          }}
          primaryButton={{
            label: "Add Todo",
            icon: <AddIcon className="size-3" />,
            classNames: { inner: "!px-2" },
            onClick: () => dispatch(openDrawer({ type: "add_todo" })),
          }}
        />
        <TanStackReusableTable
          data={todos}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load todos"
          emptyMessage="No Data found"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          className="flex-auto"
          minWidth={700}
        />
      </div>
    </div>
  );
};

export default Dashboard;
