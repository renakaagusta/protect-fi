import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  txHash?: string;
  isLoading?: boolean;
}

const SuccessDialog = ({ 
  open, 
  onOpenChange, 
  txHash,
  isLoading = false 
}: SuccessDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span>Transaction in progress</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Transaction successful</span>
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {isLoading ? (
              <p>Please wait while your transaction is being confirmed...</p>
            ) : (
              <>
                <p>Your transaction has been confirmed!</p>
                {txHash && (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      Transaction Hash: 
                      <span className="ml-1 font-mono text-xs">
                        {txHash.slice(0, 6)}...{txHash.slice(-4)}
                      </span>
                    </p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(txHash)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Close'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuccessDialog;