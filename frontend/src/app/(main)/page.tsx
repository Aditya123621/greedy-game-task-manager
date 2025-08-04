"use client";

import {
  Button,
  Table,
  Skeleton,
  Alert,
  Badge,
  ActionIcon,
  Loader,
} from "@mantine/core";
import React, { useMemo, useState, useEffect, useRef } from "react";
import FilterIcon from "@@/icons/filter-icon.svg";
import AddIcon from "@@/icons/add-icon.svg";
import EditIcon from "@@/icons/edit-icon-2.svg";
import DeleteIcon from "@@/icons/delete-icon.svg";
import SortIcon from "@@/icons/sort-icon.svg";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
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

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();
  const dispatch = useDispatch<AppDispatch>();
  const observerRef = useRef<HTMLDivElement | null>(null);
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const columnHelper = createColumnHelper<TodoItem>();

  const columns = useMemo(
    () => [
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
        header: ({ column }) => (
          <SortableHeader
            label="Due Date"
            direction={column.getIsSorted()}
            onClick={() => column.toggleSorting()}
          />
        ),
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
        header: ({ column }) => (
          <SortableHeader
            label="Status"
            direction={column.getIsSorted()}
            onClick={() => column.toggleSorting()}
          />
        ),
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
    ],
    [columnHelper]
  );

  const table = useReactTable<TodoItem>({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 150,
      minSize: 50,
      maxSize: 400,
    },
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      const sort = newSorting[0];
      setFilters((prev) => ({
        ...prev,
        sortBy: sort?.id || "dueDate",
        sortOrder: sort?.desc ? "desc" : "asc",
      }));
    },
  });

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
        <div className="grid grid-cols-5 divide-x divide-gray-200">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-custom-primary-black">
            All Todos
          </h2>
          <div className="flex gap-3">
            <Button
              size="md"
              color="#F8F9FA"
              leftSection={<FilterIcon className="size-5" />}
              classNames={{ label: "!text-[#6A7383]", inner: "!px-4" }}
            >
              Filter
            </Button>
            <Button
              size="md"
              leftSection={<AddIcon className="size-3" />}
              classNames={{ inner: "!px-2" }}
              onClick={() => {
                dispatch(openDrawer({ type: "add_todo" }));
              }}
            >
              Add Todo
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton height={300} />
        ) : isError ? (
          <Alert color="red">Failed to load todos</Alert>
        ) : todos.length === 0 ? (
          <div className="flex-auto text-3xl flex justify-center items-center">
            No Data found
          </div>
        ) : (
          <Table.ScrollContainer minWidth={700}>
            <Table
              highlightOnHover
              classNames={{
                thead: "!bg-[#FAFAFA] ",
                td: "!border-b !border-dashed !border-[#E6E7EA]",
              }}
              verticalSpacing="md"
              withRowBorders={false}
              style={{
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <Table.Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.Th
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
                          maxWidth: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="text-[#657081] font-medium text-base inline-block">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Thead>
              <Table.Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <div
              ref={observerRef}
              className="h-10 flex justify-center items-center"
            >
              {isFetchingNextPage && (
                <Loader size="lg" color="primary" type="dots" />
              )}
            </div>
          </Table.ScrollContainer>
        )}
      </div>
    </div>
  );
};

const SortableHeader = ({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: false | "asc" | "desc";
  onClick: () => void;
}) => (
  <div
    className="flex items-center gap-1 cursor-pointer select-none"
    onClick={onClick}
  >
    <span>{label}</span>
    <div
      className={`transform transition-transform duration-300 ${
        direction === "asc"
          ? "rotate-180"
          : direction === "desc"
          ? "rotate-0"
          : "opacity-30"
      }`}
    >
      <SortIcon className="size-4" />
    </div>
  </div>
);

export default Dashboard;
