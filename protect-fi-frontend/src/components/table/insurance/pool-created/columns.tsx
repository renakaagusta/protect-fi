import PoolCreated from "@/types/web3/insurance/pool-created";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from 'luxon';
import { DataTableColumnHeader } from "./column-header";
import { formatTokenAmount } from "../../../../../utils/token";

export type PoolCreationRow = PoolCreated;

export function poolCreatedColumns(): ColumnDef<PoolCreationRow>[] {
  return [
    {
      id: "number",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="#"
        />
      ),
      cell: ({ row }) => <div className="w-12 py-2">{row.index + 1}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Symbol"
        />
      ),
      cell: ({ row }) => <div>{row.original.symbol}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Pool Name"
        />
      ),
      cell: ({ row }) => <div>{row.original.poolName}</div>,
    },
    {
      accessorKey: "benefit",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Benefit"
        />
      ),
      cell: ({ row }) => <div>x{row.original.benefit} premium</div>,
    },
    {
      accessorKey: "maximumPolicies",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Maximum Policies"
        />
      ),
      cell: ({ row }) => <div>{formatTokenAmount(Number(row.original.maxPolicies))}</div>,
    },
    {
      accessorKey: "period",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Period"
        />
      ),
      cell: ({ row }) => <div>{DateTime.fromMillis(Number(row.original.startedAt) * 1000).toFormat('HH:mm d LLL yyyy')} - {DateTime.fromMillis(Number(row.original.finishedAt) * 1000).toFormat('HH:mm d LLL yyyy')}</div>,
    },
    {
      accessorKey: "endOfPurchaseAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="End of purchase at"
        />
      ),
      cell: ({ row }) => <div>{DateTime.fromMillis(Number(row.original.endOfPurchaseAt) * 1000).toFormat('HH:mm d LLL yyyy')}</div>,
    }
  ];
}