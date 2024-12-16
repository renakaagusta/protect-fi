// import { ADDRESS_JACKUSD } from "@/constants/config";
// import { mockJackUSDABI } from "@/lib/abi/mockJackUSDABI";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

// export const useWithdraw = () => {
//     const [isPurchasePolicyAlertOpen, setIsPurchasePolicyAlertOpen] = useState(false);
    
//     const {
//         data: withdrawHash,
//         isPending: isWithdrawPending,
//         writeContract: writeWithdraw
//     } = useWriteContract();

//     const {
//         isLoading: isWithdrawConfirming,
//         isSuccess: isWithdrawConfirmed
//     } = useWaitForTransactionReceipt({
//         hash: withdrawHash
//     });

//     const handleWithdraw = async (amount: string) => {
//         try {
//             await writeWithdraw({
//                 abi: mockJackUSDABI,
//                 address: ADDRESS_JACKUSD,
//                 functionName: 'withdraw',
//                 args: [BigInt(amount)],
//             });

//             while (!isWithdrawConfirmed) {
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
            
//             toast.success('Withdraw successfully!');
//             setIsPurchasePolicyAlertOpen(true);
//         } catch (error) {
//             console.error('Transaction error:', error);
//             toast.error(error instanceof Error ? error.message : 'Transaction failed. Please try again.');
//         }
//     }
    
//     return {
//         isPurchasePolicyAlertOpen,
//         withdrawHash,
//         isWithdrawPending,
//         handleWithdraw,
//         isWithdrawConfirming,
//         isWithdrawConfirmed
//     }
// }