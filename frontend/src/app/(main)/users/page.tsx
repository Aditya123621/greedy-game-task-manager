"use client";

import { useMemo, useState, useEffect } from "react";
import {
  createColumnHelper,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { Button, Switch } from "@mantine/core";
import FilterIcon from "@@/icons/filter-icon.svg";
import AddIcon from "@@/icons/add-icon.svg";

import { RootState } from "@/store/store";
import { TruncateAndProvideTooltip } from "@/components/TruncateAndProvideTooltip";
import TanStackReusableTable, {
  createSortableHeader,
} from "@/components/TanStackReusableTable";
import { useGetUsersQuery, useToggleUserRole } from "@/hooks/useUserProfile";
import { SectionToolbar } from "@/components/SectionToolbar";
import { useSession } from "next-auth/react";

type UserItem = {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "user";
};

const UserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const search = useSelector((state: RootState) => state.todo.search);
  const { data: session } = useSession();

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    role: "",
  });

  const { mutate: toggleRole } = useToggleUserRole();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUsersQuery(filters);

  const users = useMemo(
    () => (data ? data.pages.flatMap((page) => page.users) : []),
    [data]
  );

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search }));
  }, [search]);

  const columnHelper = createColumnHelper<UserItem>();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Name",
          size: 300,
          cell: (info) => (
            <div className="flex flex-col gap-0.5">
              <TruncateAndProvideTooltip
                text={info.getValue()}
                className="font-medium text-custom-primary-black"
              />
              <TruncateAndProvideTooltip
                text={info.row.original.email}
                className="text-sm text-[#6B7280]"
              />
            </div>
          ),
        }),
        columnHelper.accessor("role", {
          header: createSortableHeader("Role"),
          size: 150,
          enableSorting: true,
          cell: (info) => (
            <span className="text-sm font-medium text-[#111827] capitalize">
              {info.getValue() === "super_admin" ? "Super Admin" : "Viewer"}
            </span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          size: 100,
          cell: ({ row }) => (
            <Switch
              disabled={row.original._id === session?.user?.id}
              defaultChecked={row.original.role === "super_admin"}
              onChange={() => toggleRole(row.original._id)}
              color="primary"
            />
          ),
        }),
      ] as ColumnDef<UserItem>[],
    [columnHelper, session?.user?.id, toggleRole]
  );

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    const sort = newSorting[0];
    setFilters((prev) => ({
      ...prev,
      sortBy: sort?.id || "name",
      sortOrder: sort?.desc ? "desc" : "asc",
    }));
  };

  const roleFilters = [
    { label: "User", value: "user", color: "indigo" },
    { label: "Super Admin", value: "super_admin", color: "red" },
    { label: "Clear", value: "", color: "gray" },
  ];

  return (
    <div className="bg-[#FAFAFA] p-10 flex flex-col gap-6 flex-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 flex-auto flex flex-col">
        <SectionToolbar
          title="All Users"
          secondaryButton={{
            label: "Filter",
            icon: <FilterIcon className="size-5" />,
            classNames: { label: "!text-[#6A7383]", inner: "!px-4" },
            dropdownContent: (
              <div className="flex flex-col gap-3 p-2">
                <h1 className="text-sm font-semibold">Filter By Role:</h1>
                <div className="flex gap-2">
                  {roleFilters.map((role) => (
                    <Button
                      key={role.label}
                      size="xs"
                      variant={filters.role === role.value ? "filled" : "light"}
                      color={role.color}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, role: role.value }))
                      }
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>
            ),
          }}
          primaryButton={{
            label: "Add Users",
            icon: <AddIcon className="size-3" />,
            classNames: { inner: "!px-2" },
            onClick: () => {},
            disabled: true,
          }}
        />

        <TanStackReusableTable<UserItem>
          data={users}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load users"
          emptyMessage="No Users Found"
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

export default UserTable;
