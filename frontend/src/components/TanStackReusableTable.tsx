import React, { useState, useEffect, useRef } from "react";
import { Table, Skeleton, Alert, Loader } from "@mantine/core";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table";
import SortIcon from "@@/icons/sort-icon.svg";

interface BaseTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  enableSorting?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  sorting?: SortingState;
  className?: string;
  tableClassName?: string;
  minWidth?: number;
  LoadingComponent?: React.ComponentType;
  EmptyComponent?: React.ComponentType;
  ErrorComponent?: React.ComponentType<{ message: string }>;
}

interface SortableHeaderProps {
  label: string;
  direction: false | "asc" | "desc";
  onClick: () => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  direction,
  onClick,
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

export const createSortableHeader = (label: string) => {
  const HeaderComponent = <T,>({ column }: HeaderContext<T, unknown>) => (
    <SortableHeader
      label={label}
      direction={column.getIsSorted()}
      onClick={() => column.toggleSorting()}
    />
  );

  HeaderComponent.displayName = `SortableHeader(${label})`;

  return HeaderComponent;
};

function TanStackReusableTable<T>({
  data,
  columns,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load data",
  emptyMessage = "No data found",
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  enableSorting = true,
  onSortingChange,
  sorting: externalSorting,
  className = "",
  minWidth = 700,
  LoadingComponent,
  EmptyComponent,
  ErrorComponent,
}: BaseTableProps<T>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const sorting =
    externalSorting !== undefined ? externalSorting : internalSorting;
  const setSorting = onSortingChange || setInternalSorting;

  useEffect(() => {
    if (!fetchNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 150,
      minSize: 50,
      maxSize: 400,
    },
    state: {
      sorting: enableSorting ? sorting : undefined,
    },
    onSortingChange: enableSorting
      ? (updater) => {
          const newSorting =
            typeof updater === "function" ? updater(sorting) : updater;
          setSorting(newSorting);
        }
      : undefined,
  });

  if (isLoading) {
    return LoadingComponent ? (
      <LoadingComponent />
    ) : (
      <div className={className}>
        <Skeleton height={300} />
      </div>
    );
  }

  if (isError) {
    return ErrorComponent ? (
      <ErrorComponent message={errorMessage} />
    ) : (
      <div className={className}>
        <Alert color="red">{errorMessage}</Alert>
      </div>
    );
  }

  if (data.length === 0) {
    return EmptyComponent ? (
      <EmptyComponent />
    ) : (
      <div
        className={`flex-auto text-3xl flex justify-center items-center ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      <Table.ScrollContainer minWidth={minWidth}>
        <Table
          highlightOnHover
          classNames={{
            thead: "!bg-[#FAFAFA]",
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {fetchNextPage && (
          <div
            ref={observerRef}
            className="h-10 flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <Loader size="lg" color="primary" type="dots" />
            )}
          </div>
        )}
      </Table.ScrollContainer>
    </div>
  );
}

export default TanStackReusableTable;
