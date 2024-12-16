import faucetABI from '@/abis/faucet/FaucetABI';
import { FAUCET_ADDRESS } from '@/constants/contract-address';
import { HexAddress } from '@/types/web3/general/address';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const useRequestToken = (
) => {
    const [isPurchasePolicyAlertOpen, setIsPurchasePolicyAlertOpen] = useState(false);

    const {
        data: requestTokenHash,
        isPending: isRequestTokenPending,
        writeContract: writeRequestToken
    } = useWriteContract();

    const {
        isLoading: isRequestTokenConfirming,
        isSuccess: isRequestTokenConfirmed
    } = useWaitForTransactionReceipt({
        hash: requestTokenHash,
    });

    const handleRequestToken = async (receiverAddress: HexAddress, tokenAddress: HexAddress) => {
        try {
            const result =  writeRequestToken({
                abi: faucetABI,
                address: FAUCET_ADDRESS,
                functionName: 'requestToken',
                args: [receiverAddress, tokenAddress],
            });
            
            while (!isRequestTokenConfirmed) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            toast.success('Token has been requested');
            setIsPurchasePolicyAlertOpen(true);
        } catch (error) {
            console.error('Transaction error:', error);
            toast.error(error instanceof Error ? error.message : 'Transaction failed. Please try again.');
        }
    };

    return {
        isPurchasePolicyAlertOpen,
        setIsPurchasePolicyAlertOpen,
        requestTokenHash,
        isRequestTokenPending,
        isRequestTokenConfirming,
        handleRequestToken,
        isRequestTokenConfirmed
    };
};