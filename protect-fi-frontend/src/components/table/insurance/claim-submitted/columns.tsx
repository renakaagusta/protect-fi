import ClaimSubmitted from "@/types/web3/insurance/claim-submitted";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "./column-header";

export type TransactionHistoryRow = ClaimSubmitted;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied to clipboard!')
  }).catch(err => {
    toast.error(`Failed to copy to clipboard! ${err}`)
  });
};

export function claimSubmittedColumns(): ColumnDef<TransactionHistoryRow>[] {
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center truncate w-fit justify-between">
          <span className="mr-2">{row.original.id}</span>
          <button
            onClick={() => copyToClipboard(row.original.id)}
            aria-label="Copy to clipboard"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Copy size={16} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "insured",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Insured"
        />
      ),
      cell: ({ row }) => <div>{row.original.claim_insured}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
        />
      ),
      cell: ({ row }) => <div>{row.original.claim_amount}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => <div className={`${row.original.claim_isApproved ? 'text-green-500' : 'text-red-500'}`}>{row.original.claim_isApproved ? 'Approved' : 'Rejected'}</div>,
    },
    {
      accessorKey: "proofUri",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Proof"
        />
      ),
      cell: ({ row }) => (
        <a href={row.original.claim_proofUri} target="_blank">
          <div className="flex items-center truncate w-fit justify-between">
            <span className="mr-2">{row.original.claim_proofUri}</span>
          </div>
        </a>
      ),
    },
    {
      accessorKey: "blockNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Block Number"
        />
      ),
      cell: ({ row }) => <div>{row.original.blockNumber}</div>,
    },
    {
      accessorKey: "blockTimestamp",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Timestamp"
        />
      ),
      cell: ({ row }) => <div>{row.original.blockTimestamp}</div>,
    },
    {
      accessorKey: "transactionHash",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Transaction Hash"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center truncate w-fit justify-between">
          <span className="mr-2">{row.original.transactionHash}</span>
          <button
            onClick={() => copyToClipboard(String(row.original.transactionHash))}
            aria-label="Copy to clipboard"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Copy size={16} />
          </button>
        </div>
      ),
    },
  ];
}