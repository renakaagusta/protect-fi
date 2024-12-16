import InsurancePoolABI from '@/abis/insurance/InsurancePoolABI';
import ERC20ABI from '@/abis/tokens/ERC20ABI';
import { wagmiConfig } from '@/configs/wagmi';
import { USDE_ADDRESS } from '@/constants/contract-address';
import { HexAddress } from '@/types/web3/general/address';
import { readContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const useInitialDeposit = () => {
    const [isInitialDepositAlertOpen, setIsInitialDepositAlertOpen] = useState(false);
    const [approvalParams, setApprovalParams] = useState<{
        poolAddress?: HexAddress,
        maxPolicies?: number,
        benefit?: number,
        insurer?: HexAddress
    }>();
     const [simulationParams, setSimulationParams] = useState<{
        poolAddress?: HexAddress,
        maxPolicies?: number,
        benefit?: number,
        insurer?: HexAddress
    }>();

    const {
        data: simulateData,
        isError: isInitialDepositSimulationError,
        isLoading: isInitialDepositSimulationLoading,
        refetch: refetchInitialDepositSimulation,
        error: simulateError,
    } = useSimulateContract({
        address: simulationParams?.poolAddress,
        abi: InsurancePoolABI,
        functionName: 'initialDeposit',
        args: simulationParams?.poolAddress ? [] : undefined,
    });

    const {
        data: initialDepositHash,
        isPending: isInitialDepositPending,
        writeContract: writeInitialDeposit
    } = useWriteContract();

    const {
        isLoading: isInitialDepositConfirming,
        isSuccess: isInitialDepositConfirmed
    } = useWaitForTransactionReceipt({
        hash: initialDepositHash,
    });

    const {
        data: purchasePolicyApprovalHash,
        isPending: isInitialDepositApprovalPending,
        writeContract: writeInitialDepositApproval
    } = useWriteContract();

    const {
        isLoading: isInitialDepositApprovalConfirming,
        isSuccess: isInitialDepositApprovalConfirmed
    } = useWaitForTransactionReceipt({
        hash: purchasePolicyApprovalHash,
    });

    const handleApprovalInitialDeposit = async (poolAddress: HexAddress, maxPolicies: number, benefit: number, insurer: HexAddress) => {
        const allowance = await readContract(wagmiConfig, {
            address: USDE_ADDRESS,
            abi: ERC20ABI,
            functionName: 'allowance',
            args: [insurer, poolAddress],
        });

        setApprovalParams({
            poolAddress,
            maxPolicies,
            insurer,
            benefit
        })

        if (Number(allowance) < (maxPolicies * benefit)) {
            toast.info('Requesting allowance')
            writeInitialDepositApproval({
                address: USDE_ADDRESS,
                abi: ERC20ABI,
                functionName: 'approve',
                args: [poolAddress, (maxPolicies * benefit)],
            });
        } else {
            setSimulationParams({ poolAddress, maxPolicies, benefit, insurer });
            setApprovalParams(undefined);
        }
    };

    const handleInitialDeposit = async () => {
        try {
            if(!approvalParams) {
                return;
            }

            const { poolAddress, maxPolicies, benefit, insurer } = approvalParams
            console.log('============ InitialDeposit Policy Parameters ============');
            console.log('Contract Details:');
            console.log(`Address: ${poolAddress}`);
            console.log(`Function: initialDeposit`);
            console.log('\nArguments:');
            console.log(`Shares: ${maxPolicies}`);
            console.log(`Assets in USDe: ${benefit}`);
            console.log(`Insured: ${insurer}`);
            console.log('===============================================');

            setSimulationParams({ poolAddress, maxPolicies, benefit, insurer });
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

        if(isInitialDepositSimulationLoading) {
            return;
        }

        refetchInitialDepositSimulation();
    }, [simulationParams, isInitialDepositSimulationLoading])

    useEffect(() => {
        if (!isInitialDepositApprovalConfirmed && isInitialDepositConfirming) {
            return;
        }

        if(!approvalParams) {
            return;
        }

        handleInitialDeposit();
    }, [isInitialDepositConfirmed, isInitialDepositConfirming, isInitialDepositApprovalConfirmed, simulationParams]);

    useEffect(() => {
        if (!isInitialDepositConfirmed) {
            return;
        }

        toast.success('Pool has been initialized');
        setIsInitialDepositAlertOpen(true);
    }, [isInitialDepositConfirmed]);

    useEffect(() => {
        if (!simulateError || !isInitialDepositSimulationError || isInitialDepositSimulationLoading) {
            return;
        }

        toast.info(simulateError.toString())
    }, [simulateError, isInitialDepositSimulationError])

    useEffect(() => {
        if(!simulateData || isInitialDepositConfirming) {
            return;
        }

        writeInitialDeposit(simulateData.request);
        setSimulationParams(undefined);
    }, [simulateData])

    return {
        isInitialDepositAlertOpen,
        setIsInitialDepositAlertOpen,
        initialDepositHash,
        isInitialDepositPending,
        isInitialDepositApprovalPending,
        isInitialDepositConfirming,
        isInitialDepositApprovalConfirming,
        handleApprovalInitialDeposit,
        isInitialDepositConfirmed,
        isInitialDepositSimulationError,
        isInitialDepositSimulationLoading,
        simulateError
    };
};