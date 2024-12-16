import InsurancePoolABI from '@/abis/insurance/InsurancePoolABI';
import ERC20ABI from '@/abis/tokens/ERC20ABI';
import { wagmiConfig } from '@/configs/wagmi';
import { USDE_ADDRESS } from '@/constants/contract-address';
import { HexAddress } from '@/types/web3/general/address';
import { readContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const useSubmitClaim = () => {
    const [isSubmitClaimAlertOpen, setIsSubmitClaimAlertOpen] = useState(false);
    const [approvalParams, setApprovalParams] = useState<{
        poolAddress?: HexAddress,
        claimFee?: number,
        storageFee?: number,
        insured?: HexAddress
    }>();
     const [simulationParams, setSimulationParams] = useState<{
        poolAddress?: HexAddress,
        claimFee?: number,
        storageFee?: number,
        insured?: HexAddress
    }>();

    const {
        data: simulateData,
        isError: isSubmitClaimSimulationError,
        isLoading: isSubmitClaimSimulationLoading,
        refetch: refetchSubmitClaimSimulation,
        error: simulateError,
    } = useSimulateContract({
        address: simulationParams?.poolAddress,
        abi: InsurancePoolABI,
        functionName: 'submitClaim',
        args: simulationParams?.poolAddress ? [
        ] : undefined,
    });

    const {
        data: submitClaimHash,
        isPending: isSubmitClaimPending,
        writeContract: writeSubmitClaim
    } = useWriteContract();

    const {
        isLoading: isSubmitClaimConfirming,
        isSuccess: isSubmitClaimConfirmed
    } = useWaitForTransactionReceipt({
        hash: submitClaimHash,
    });

    const {
        data: purchasePolicyApprovalHash,
        isPending: isSubmitClaimApprovalPending,
        writeContract: writeSubmitClaimApproval
    } = useWriteContract();

    const {
        isLoading: isSubmitClaimApprovalConfirming,
        isSuccess: isSubmitClaimApprovalConfirmed
    } = useWaitForTransactionReceipt({
        hash: purchasePolicyApprovalHash,
    });

    const handleApprovalSubmitClaim = async (poolAddress: HexAddress, claimFee: number, storageFee: number, insured: HexAddress) => {
        const allowance = await readContract(wagmiConfig, {
            address: USDE_ADDRESS,
            abi: ERC20ABI,
            functionName: 'allowance',
            args: [insured, poolAddress],
        });

        console.log({
            claimFee,
            storageFee,
        })

        setApprovalParams({
            poolAddress,
            claimFee,
            insured,
            storageFee
        })

        if (Number(allowance) < claimFee * 2) {
            toast.info('Requesting allowance')
            writeSubmitClaimApproval({
                address: USDE_ADDRESS,
                abi: ERC20ABI,
                functionName: 'approve',
                args: [poolAddress, claimFee * 2],
            });
        } else {
            setSimulationParams({ poolAddress, claimFee, storageFee, insured });
            setApprovalParams(undefined);
        }
    };

    const handleSubmitClaim = async () => {
        try {
            if(!approvalParams) {
                return;
            }

            const { poolAddress, claimFee, storageFee, insured } = approvalParams
            console.log('============ Submit Claim Parameters ============');
            console.log('Contract Details:');
            console.log(`Address: ${poolAddress}`);
            console.log(`Function: submitClaim`);
            console.log('\nArguments:');
            console.log(`Shares: ${claimFee}`);
            console.log(`Assets in USDe: ${storageFee}`);
            console.log(`Insured: ${insured}`);
            console.log('===============================================');

            setSimulationParams({ poolAddress, claimFee, storageFee, insured });
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

        if(isSubmitClaimSimulationLoading) {
            return;
        }

        refetchSubmitClaimSimulation();
    }, [simulationParams, isSubmitClaimSimulationLoading])

    useEffect(() => {
        if (!isSubmitClaimApprovalConfirmed && isSubmitClaimConfirming) {
            return;
        }

        if(!approvalParams) {
            return;
        }

        handleSubmitClaim();
    }, [isSubmitClaimConfirmed, isSubmitClaimConfirming, isSubmitClaimApprovalConfirmed, simulationParams]);

    useEffect(() => {
        if (!isSubmitClaimConfirmed) {
            return;
        }

        toast.success('Claim has been submitted');
        setIsSubmitClaimAlertOpen(true);
    }, [isSubmitClaimConfirmed]);

    useEffect(() => {
        if (!simulateError || !isSubmitClaimSimulationError || isSubmitClaimSimulationLoading) {
            return;
        }

        toast.info(simulateError.toString())
        setSimulationParams(undefined)
    }, [simulateError, isSubmitClaimSimulationError])

    useEffect(() => {
        if(!simulateData || isSubmitClaimConfirming) {
            return;
        }

        writeSubmitClaim(simulateData.request);
        setSimulationParams(undefined);
    }, [simulateData])

    // console.log('approval params', approvalParams)
    // console.log('simulation params', simulationParams)

    return {
        isSubmitClaimAlertOpen,
        setIsSubmitClaimAlertOpen,
        submitClaimHash,
        isSubmitClaimPending,
        isSubmitClaimApprovalPending,
        isSubmitClaimConfirming,
        isSubmitClaimApprovalConfirming,
        handleApprovalSubmitClaim,
        isSubmitClaimConfirmed,
        isSubmitClaimSimulationError,
        isSubmitClaimSimulationLoading,
        simulateError
    };
};