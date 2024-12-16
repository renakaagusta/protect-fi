import InsuranceFactoryABI from '@/abis/insurance/InsuranceFactoryABI';
import { INSURANCE_FACTORY } from '@/constants/contract-address';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const useCreateInsurancePool = (
) => {
    const [isPurchasePolicyAlertOpen, setIsPurchasePolicyAlertOpen] = useState(false);

    const {
        data: createPoolHash,
        isPending: isCreateInsurancePoolPending,
        writeContract: writeCreateInsurancePool
    } = useWriteContract();

    const {
        isLoading: isCreateInsurancePoolConfirming,
        isSuccess: isCreateInsurancePoolConfirmed
    } = useWaitForTransactionReceipt({
        hash: createPoolHash,
    });

    const handleCreateInsurancePool = async (name: string, symbol: string, descriptionUri: string, exampleResponseUri: string, curl: string, encryptedCurlSecretKey: string, encryptedApplicationID: string, encryptedApplicationSecret: string, regexExtraction: string, regexValidation: string, claimFee: number, benefit: number, startedAt: number, finishedAt: number, endOfPurchaseAt: number, maxPolicies: number) => {
        try {
            writeCreateInsurancePool({
                abi: InsuranceFactoryABI,
                address: INSURANCE_FACTORY,
                functionName: 'createInsurancePool',
                args: [name, symbol, descriptionUri, exampleResponseUri, curl, encryptedCurlSecretKey, encryptedApplicationID, encryptedApplicationSecret, regexExtraction, regexValidation, claimFee, benefit, startedAt, finishedAt, endOfPurchaseAt, maxPolicies],
            });
        } catch (error) {
            console.error('Transaction error:', error);
            toast.error(error instanceof Error ? error.message : 'Transaction failed. Please try again.');
        }
    };

    useEffect(() => {
        if(!isCreateInsurancePoolConfirmed) {
            return;
        }

        toast.success('Pool has been created');
        setIsPurchasePolicyAlertOpen(true);
    }, [isCreateInsurancePoolConfirmed])

    return {
        isPurchasePolicyAlertOpen,
        setIsPurchasePolicyAlertOpen,
        createPoolHash,
        isCreateInsurancePoolPending,
        isCreateInsurancePoolConfirming,
        handleCreateInsurancePool,
        isCreateInsurancePoolConfirmed
    };
};