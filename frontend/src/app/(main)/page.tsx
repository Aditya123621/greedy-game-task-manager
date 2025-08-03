"use client";
import { Button, Table } from "@mantine/core";
import React, { useMemo } from "react";
import FilterIcon from "@@/icons/filter-icon.svg";
import AddIcon from "@@/icons/add-icon.svg";
import EditIcon from "@@/icons/edit-icon-2.svg";
import DeleteIcon from "@@/icons/delete-icon.svg";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { openDrawer } from "@/store/slices/drawerSlice";

const Dashboard = () => {
  const todos = [
    {
      id: 1,
      title: "Submit project report",
      description:
        "Submit and submit the quarterly project report to the manager by...",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Completed",
    },
    {
      id: 2,
      title: "Team stand-up meeting",
      description:
        "Join the daily stand-up meeting with the product team on Zoom",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Pending",
    },
    {
      id: 3,
      title: "Client follow-up email",
      description:
        "Craft and send the follow-up email to the client regarding the new...",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Pending",
    },
    {
      id: 4,
      title: "Review pull requests",
      description:
        "Check and review the pending pull requests on GitHub before 5:00...",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Completed",
    },
    {
      id: 5,
      title: "Buy groceries",
      description:
        "Pick up essentials like vegetables, milk, and bread from the nearby...",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Pending",
    },
    {
      id: 6,
      title: "Workout session",
      description: "Attend the 7:00 PM virtual HR1 workout class scheduled.",
      dueDate: "16/08/2023",
      dueTime: "18:00",
      status: "Completed",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();

  const todoStats = [
    { label: "All Todos", count: 12 },
    { label: "Upcoming", count: 4 },
    { label: "Completed", count: 6 },
  ];

  const getStatusBadgeColor = (status) => {
    return status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Task",
        cell: (info) => (
          <div className="max-w-xs">
            <h3 className="font-medium text-gray-900 mb-1">
              {info.getValue()}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {info.row.original.description}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("dueDate", {
        header: "Due Date",
        cell: (info) => (
          <div className="text-sm text-gray-600">
            <div>{info.getValue()}</div>
            <div>{info.row.original.dueTime}</div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                status
              )}`}
            >
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <EditIcon className="size-4" />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <DeleteIcon className="size-4" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-[#FAFAFA] p-10 flex flex-col gap-6">
      <h1 className="text-[#111827] font-bold text-2xl">Hello, Aditya</h1>

      <div className="bg-white py-4 !rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-gray-200">
          {todoStats.map((stat, idx) => (
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
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

        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                    <Table.Td key={cell.id}>
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
        </Table.ScrollContainer>
      </div>
    </div>
  );
};

export default Dashboard;
