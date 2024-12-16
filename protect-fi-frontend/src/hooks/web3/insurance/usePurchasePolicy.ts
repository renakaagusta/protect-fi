import InsurancePoolABI from '@/abis/insurance/InsurancePoolABI';
import ERC20ABI from '@/abis/tokens/ERC20ABI';
import { wagmiConfig } from '@/configs/wagmi';
import { USDE_ADDRESS } from '@/constants/contract-address';
import { HexAddress } from '@/types/web3/general/address';
import { readContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const usePurchasePolicy = () => {
    const [isPurchasePolicyAlertOpen, setIsPurchasePolicyAlertOpen] = useState(false);
    const [approvalParams, setApprovalParams] = useState<{
        poolAddress?: HexAddress,
        shares?: number,
        assetsInUSDe?: number,
        insured?: HexAddress
    }>();
     const [simulationParams, setSimulationParams] = useState<{
        poolAddress?: HexAddress,
        shares?: number,
        assetsInUSDe?: number,
        insured?: HexAddress
    }>();

    const {
        data: simulateData,
        isError: isPurchasePolicySimulationError,
        isLoading: isPurchasePolicySimulationLoading,
        refetch: refetchPurchasePolicySimulation,
        error: simulateError,
    } = useSimulateContract({
        address: simulationParams?.poolAddress,
        abi: InsurancePoolABI,
        functionName: 'purchasePolicy',
        args: simulationParams?.poolAddress ? [
            simulationParams.shares,
            simulationParams.assetsInUSDe,
            simulationParams.insured
        ] : undefined,
    });

    const {
        data: purchasePolicyHash,
        isPending: isPurchasePolicyPending,
        writeContract: writePurchasePolicy
    } = useWriteContract();

    const {
        isLoading: isPurchasePolicyConfirming,
        isSuccess: isPurchasePolicyConfirmed
    } = useWaitForTransactionReceipt({
        hash: purchasePolicyHash,
    });

    const {
        data: purchasePolicyApprovalHash,
        isPending: isPurchasePolicyApprovalPending,
        writeContract: writePurchasePolicyApproval
    } = useWriteContract();

    const {
        isLoading: isPurchasePolicyApprovalConfirming,
        isSuccess: isPurchasePolicyApprovalConfirmed
    } = useWaitForTransactionReceipt({
        hash: purchasePolicyApprovalHash,
    });

    const handleApprovalPurchasePolicy = async (poolAddress: HexAddress, shares: number, assetsInUSDe: number, insured: HexAddress) => {
        const allowance = await readContract(wagmiConfig, {
            address: USDE_ADDRESS,
            abi: ERC20ABI,
            functionName: 'allowance',
            args: [insured, poolAddress],
        });

        setApprovalParams({
            poolAddress,
            shares,
            insured,
            assetsInUSDe
        })

        if (Number(allowance) < assetsInUSDe) {
            toast.info('Requesting allowance')
            writePurchasePolicyApproval({
                address: USDE_ADDRESS,
                abi: ERC20ABI,
                functionName: 'approve',
                args: [poolAddress, assetsInUSDe],
            });
        } else {
            setSimulationParams({ poolAddress, shares, assetsInUSDe, insured });
            setApprovalParams(undefined);
        }
    };

    const handlePurchasePolicy = async () => {
        try {
            if(!approvalParams) {
                return;
            }

            const { poolAddress, shares, assetsInUSDe, insured } = approvalParams
            console.log('============ Purchase Policy Parameters ============');
            console.log('Contract Details:');
            console.log(`Address: ${poolAddress}`);
            console.log(`Function: purchasePolicy`);
            console.log('\nArguments:');
            console.log(`Shares: ${shares}`);
            console.log(`Assets in USDe: ${assetsInUSDe}`);
            console.log(`Insured: ${insured}`);
            console.log('===============================================');

            setSimulationParams({ poolAddress, shares, assetsInUSDe, insured });
            setApprovalParams(undefined);
        } catch (error) {
            console.error('Transaction error:', error);
            toast.error(error instanceof Error ? error.message : 'Transaction failed. Please try again.');
        }
    };

    useEffect(() => {
        if(!simulationParams) {
            return;
        }

        if(isPurchasePolicySimulationLoading) {
            return;
        }

        refetchPurchasePolicySimulation();
    }, [simulationParams, isPurchasePolicySimulationLoading])

    useEffect(() => {
        if (!isPurchasePolicyApprovalConfirmed && isPurchasePolicyConfirming) {
            return;
        }

        if(!approvalParams) {
            return;
        }

        handlePurchasePolicy();
    }, [isPurchasePolicyConfirmed, isPurchasePolicyConfirming, isPurchasePolicyApprovalConfirmed, simulationParams]);

    useEffect(() => {
        if (!isPurchasePolicyConfirmed) {
            return;
        }

        toast.success('Policy has been purchased');
        setIsPurchasePolicyAlertOpen(true);
    }, [isPurchasePolicyConfirmed]);

    useEffect(() => {
        if (!simulateError || !isPurchasePolicySimulationError || isPurchasePolicySimulationLoading) {
            return;
        }

        toast.info(simulateError.toString())
    }, [simulateError, isPurchasePolicySimulationError])

    useEffect(() => {
        if(!simulateData || isPurchasePolicyConfirming) {
            return;
        }

        writePurchasePolicy(simulateData.request);
        setSimulationParams(undefined);
    }, [simulateData])

    // console.log('approval params', approvalParams)
    // console.log('simulation params', simulationParams)

    return {
        isPurchasePolicyAlertOpen,
        setIsPurchasePolicyAlertOpen,
        purchasePolicyHash,
        isPurchasePolicyPending,
        isPurchasePolicyApprovalPending,
        isPurchasePolicyConfirming,
        isPurchasePolicyApprovalConfirming,
        handleApprovalPurchasePolicy,
        isPurchasePolicyConfirmed,
        isPurchasePolicySimulationError,
        isPurchasePolicySimulationLoading,
        simulateError
    };
};