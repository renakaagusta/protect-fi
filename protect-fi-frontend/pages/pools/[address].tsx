'use client';

import ClientWrapper from "@/components/wrapper/client-wrapper";
import { INSURANCE_SUBGRAPH_URL } from "@/constants/subgraph-url";

import { Button } from "@/components/button/button";
import CurlViewer from "@/components/curl-viewer/curl-viewer";
import { DialogFooter, DialogHeader } from "@/components/dialog/dialog";
import JSONPreviewer from "@/components/json-viewer/json-previewer";
import { Label } from "@/components/label/label";
import MDXViewer from "@/components/markdown-viewer/mdx-viewer";
import PoolChart, { PoolData } from "@/components/pool-chart/pool-chart";
import SuccessDialog from "@/components/success-dialog/success-dialog";
import { DataTable } from "@/components/table/data-table";
import { claimSubmittedColumns } from "@/components/table/insurance/claim-submitted/columns";
import { policyPurchasedColumns } from "@/components/table/insurance/policy-purchased/columns";
import TokenInput from "@/components/token-input/token-input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryClaimApprovedsByPool, queryClaimRejectedsByPool, queryClaimSubmittedsByPool, queryPolicyPurchasedsByPool, queryPoolCreatedsByPool } from "@/graphql/insurance/insurance.query";
import { useInitialDeposit } from "@/hooks/web3/insurance/useInitialDeposit";
import { useInitialStakedUSDePrice } from "@/hooks/web3/insurance/useInitialStakedUSDePrice";
import { usePreviewMintInUSDe } from "@/hooks/web3/insurance/usePreviewDepositInUSDe";
import { usePurchasePolicy } from "@/hooks/web3/insurance/usePurchasePolicy";
import { useStorageFee } from "@/hooks/web3/insurance/useStoragePrice";
import { useSubmitClaim } from "@/hooks/web3/insurance/useSubmitClaim";
import { useBalance } from "@/hooks/web3/token/useBalance";
import { useTotalSupply } from "@/hooks/web3/token/useTotalSupply";
import { useConvertToAssets } from "@/hooks/web3/vault/useConvertToAssets";
import { HexAddress } from "@/types/web3/general/address";
import { ClaimApproveds } from "@/types/web3/insurance/claim-approved";
import { ClaimRejecteds } from "@/types/web3/insurance/claim-rejected";
import ClaimSubmitted, { ClaimSubmitteds } from "@/types/web3/insurance/claim-submitted";
import { PolicyPurchaseds } from "@/types/web3/insurance/policy-purchased";
import PoolCreated, { InsurancePoolCreateds } from "@/types/web3/insurance/pool-created";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { request } from 'graphql-request';
import { Info, Loader2 } from "lucide-react";
import { DateTime } from 'luxon';
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAddress } from "viem";
import { useAccount } from "wagmi";
import { formatTokenAmount } from "../../utils/token";
import { cn } from "@/lib/utils";

enum PoolTableType {
    Purchase = "Purchase",
    Claim = "Claim"
}

const PoolDetails: NextPage = () => {
    const router = useRouter();
    const { address: poolAddress } = router.query;
    const { address: userAddress } = useAccount();

    const [poolData, setPoolData] = useState<PoolCreated>();
    const [currentPoolShares, setCurrentPoolShares] = useState<PoolData[]>([]);
    const [projectionPoolShares, setProjectionPoolShares] = useState<PoolData[]>([]);
    const [submittedClaims, setSubmittedClaims] = useState<ClaimSubmitted[]>();

    const [activeTab, setActiveTab] = useState<PoolTableType>(PoolTableType.Purchase);
    const [purchaseAmount, setPurchaseAmount] = useState<number>(1);
    const [currentYieldPercentage, setCurrentYieldPercentage] = useState<number>(0);
    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

    const {
        isPurchasePolicyAlertOpen,
        isPurchasePolicyConfirming,
        isPurchasePolicySimulationLoading,
        isPurchasePolicyApprovalConfirming,
        purchasePolicyHash,
        setIsPurchasePolicyAlertOpen,
        handleApprovalPurchasePolicy
    } = usePurchasePolicy();
    const {
        isInitialDepositAlertOpen,
        isInitialDepositConfirming,
        isInitialDepositSimulationLoading,
        isInitialDepositApprovalConfirming,
        initialDepositHash,
        setIsInitialDepositAlertOpen,
        handleApprovalInitialDeposit
    } = useInitialDeposit();
    const {
        isSubmitClaimAlertOpen,
        isSubmitClaimConfirming,
        isSubmitClaimSimulationLoading,
        isSubmitClaimApprovalConfirming,
        submitClaimHash,
        setIsSubmitClaimAlertOpen,
        handleApprovalSubmitClaim
    } = useSubmitClaim();

    const { initialStakedUSDePrice } = useInitialStakedUSDePrice(poolAddress as HexAddress);
    const { storageFee } = useStorageFee();
    const { assets: currentStakedUSDePrice } = useConvertToAssets(1e18);
    const { assetsInUSDe, loading: assetsInUSDeLoading } = usePreviewMintInUSDe(poolAddress as HexAddress, purchaseAmount);
    const { balance: policies } = useBalance(poolAddress as HexAddress, userAddress as HexAddress);
    const { totalSupply: totalPolicies } = useTotalSupply(poolAddress as HexAddress);

    const { data: poolCreateds, isLoading: poolCreatedsLoading, refetch: poolCreatedsRefetch } = useQuery<InsurancePoolCreateds>({
        queryKey: ['insurancePoolCreateds', poolAddress],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryPoolCreatedsByPool, { poolAddress: poolAddress, first: 1 });
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: poolAddress !== undefined
    });

    const { data: policyPurchaseds, isLoading: policyPurchasedsLoading, refetch: policyPurchasedsRefetch } = useQuery<PolicyPurchaseds>({
        queryKey: ['queryPolicyPurchaseds', poolAddress],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryPolicyPurchasedsByPool, { pool: poolAddress });
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: poolAddress !== undefined
    });

    const { data: claimRejecteds, isLoading: claimRejectedsIsLoading, refetch: claimRejectedsRefetch } = useQuery<ClaimRejecteds>({
        queryKey: ['claimApproveds', poolAddress],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryClaimRejectedsByPool, { pool: poolAddress });
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
    });

    const { data: claimApproveds, isLoading: claimApprovedsIsLoading, refetch: claimApprovedsRefetch } = useQuery<ClaimApproveds>({
        queryKey: ['claimRejecteds', poolAddress],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryClaimApprovedsByPool, { pool: poolAddress });
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
    });

    const { data: claimSubmitteds, isLoading: claimSubmittedsIsLoading, refetch: claimSubmittedsRefetch } = useQuery<ClaimSubmitteds>({
        queryKey: ['claimSubmitteds', poolAddress],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryClaimSubmittedsByPool, { pool: poolAddress });
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
    });

    useEffect(() => {
        if (!initialStakedUSDePrice || !currentStakedUSDePrice) {
            return;
        }

        console.log({
            initialStakedUSDePrice,
            currentStakedUSDePrice
        })

        setCurrentYieldPercentage((Number(currentStakedUSDePrice) - Number(initialStakedUSDePrice)) / Number(initialStakedUSDePrice) * 100)
    }, [initialStakedUSDePrice, currentStakedUSDePrice])

    useEffect(() => {
        if (!claimSubmitteds) {
            return;
        }

        let submittedClaims = [...(claimSubmitteds.claimSubmitteds)];

        submittedClaims.forEach((submittedClaim, index) => {
            const updatedClaim = claimApproveds?.claimApproveds.find((claimApproved) => claimApproved.claim_index === submittedClaim.claim_index) ?? claimRejecteds?.claimRejecteds.find((claimRejected) => claimRejected.claim_index === submittedClaim.claim_index)

            submittedClaims[index].claim_isApproved = updatedClaim?.claim_isApproved ?? false;
            submittedClaims[index].claim_proofUri = updatedClaim?.claim_proofUri ?? '';
        })

        setSubmittedClaims(submittedClaims)
    }, [claimApproveds, claimRejecteds, claimSubmitteds])

    useEffect(() => {
        if (!poolCreateds || poolCreateds.insurancePoolCreateds.length === 0) {
            return;
        }

        setPoolData(poolCreateds.insurancePoolCreateds[0]);
    }, [poolCreateds])

    useEffect(() => {
        if (!poolData) {
            return;
        }

        setProjectionPoolShares([{
            label: 'Insurer',
            value: Number(poolData.benefit) * Number(poolData.maxPolicies)
        }, {
            label: 'Insured',
            value: Number(poolData.maxPolicies)
        }])
    }, [poolData])

    useEffect(() => {
        if (!poolData || !policyPurchaseds) {
            return;
        }

        setCurrentPoolShares([{
            label: 'Insurer',
            value: Number(poolData.benefit) * Number(poolData.maxPolicies)
        },
        ...policyPurchaseds.policyPurchaseds.map((policyPurchased) => ({
            label: policyPurchased.insured,
            value: Number(policyPurchased.shares),
        }))
        ])
    }, [poolData, policyPurchaseds])

    const onPurchase = async () => {
        if (purchaseAmount < 0 || (purchaseAmount * 10e18) > Number(poolData?.maxPolicies)) {
            return;
        }

        if (assetsInUSDeLoading || !poolAddress || !userAddress) {
            return;
        }

        handleApprovalPurchasePolicy(poolAddress as HexAddress, purchaseAmount * 10e18, Number(assetsInUSDe) * 10e18, userAddress);
    };

    const onSubmitClaim = async () => {
        if (!storageFee && !poolData) {
            return;
        }

        if (!poolAddress || !userAddress) {
            return;
        }

        handleApprovalSubmitClaim(poolAddress as HexAddress, Number(poolData?.claimFee), Number(storageFee), userAddress);
    };

    const onInitialDeposit = async () => {
        if (!poolData || !userAddress) {
            return;
        }

        handleApprovalInitialDeposit(poolAddress as HexAddress, Number(poolData?.maxPolicies), Number(poolData?.benefit), userAddress);
    };

    return (
        <main>
            <ClientWrapper>
                <div className="mt-[2rem] rounded-lg p-4 flex flex-col justify-between w-full lg:px-[5vw]  mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-600/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-500/50">
                            {poolData?.poolName} ({poolData?.symbol})
                        </h1>
                    </div>

                    <div>
                        <div className="flex flex-row gap-6">
                            <div className="basis-3/4">
                                <PoolChart projectionShares={projectionPoolShares} currentPoolShares={currentPoolShares} symbol={poolData?.symbol ?? ''}/>
                            </div>
                            <div className="basis-1/4 bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6 max-h-[35rem]">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pool Information</h2>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="flex flex-col">
                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Name</Label>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{poolData?.poolName}</p>
                                    </div>

                                    {/* Symbol */}
                                    <div className="flex flex-col">
                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Symbol</Label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.symbol}</p>
                                    </div>

                                    {/* Yield */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Yield</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Yield generated by the locked capital</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className={cn('text-sm', currentYieldPercentage > 0 ? 'text-green-500' : 'text-gray-900 dark:text-gray-100')}>{initialStakedUSDePrice && currentStakedUSDePrice ? currentYieldPercentage.toFixed(2) : '-'} %</p>
                                    </div>

                                    {/* Claim Fee */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Claim fee</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The fee required to make a claim.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatTokenAmount(Number(poolData?.claimFee))} USDe</p>
                                    </div>

                                    {/* Benefit */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Payout</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The payout benefit for this pool.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">x{poolData?.benefit} premium</p>
                                    </div>

                                    {/* Period */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Period</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The active period of the pool.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {DateTime.fromMillis(Number(poolData?.startedAt) * 1000).toFormat("dd LLL yyyy, HH:mm")} -{" "}
                                            {DateTime.fromMillis(Number(poolData?.finishedAt) * 1000).toFormat("dd LLL YYYY, HH:mm")}
                                        </p>
                                    </div>

                                    {/* End of Purchase At */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">End of Purchase At</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The deadline to purchase policies in this pool.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {DateTime.fromMillis(Number(poolData?.endOfPurchaseAt) * 1000).toFormat("dd LLL yyyy HH:mm")}
                                        </p>
                                    </div>

                                    {/* Max Policies */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Max Policies</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The maximum number of policies that can be purchased.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.maxPolicies}</p>
                                    </div>

                                    {/* Insurer */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Insurer</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info size={14}className="ml-1" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>The insurer responsible for the pool.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <a className="text-sm text-gray-900 dark:text-gray-100">{poolData?.insurer}</a>
                                    </div>
                                </div>
                                {
                                    userAddress && poolData?.insurer && userAddress === getAddress(poolData?.insurer ?? '') && <>
                                        {(totalPolicies ?? 0) > 0 ? <Dialog>
                                            <DialogTrigger asChild>
                                                {poolData?.finishedAt && <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full mt-4"
                                                    disabled={!(DateTime.now().toMillis() / 1000 > Number(poolData?.finishedAt ?? '0'))}
                                                >
                                                    Withdraw
                                                </Button>}
                                            </DialogTrigger>
                                            <DialogOverlay className="fixed inset-0 bg-black/90 z-40" />
                                            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#161a1d] rounded-lg shadow-lg p-6 z-50 max-w-lg w-full">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl pb-4 font-semibold text-gray-900 dark:text-gray-100 text-center">{poolData?.poolName}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    {/* Informasi Pool */}
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Name:</Label>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{poolData?.poolName}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Symbol:</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.symbol}</p>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Amount of Policies:</Label>
                                                        <TokenInput
                                                            max={poolData?.maxPolicies}
                                                            value={purchaseAmount}
                                                            onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                                                            symbol={poolData?.symbol}
                                                            className="mt-1"
                                                        />
                                                        <p>{purchaseAmount > 0 ? `Required balance: ${assetsInUSDe} USDe` : ''}</p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="w-full mt-4"
                                                        disabled={isPurchasePolicyConfirming || isPurchasePolicySimulationLoading || isPurchasePolicyApprovalConfirming || assetsInUSDeLoading}
                                                        onClick={onPurchase}
                                                    >
                                                        {isPurchasePolicyConfirming || isPurchasePolicySimulationLoading || isPurchasePolicyApprovalConfirming || assetsInUSDeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                                                        {
                                                            (isPurchasePolicyApprovalConfirming ? 'Requesting allowance' : (assetsInUSDeLoading ? 'Calculating USDe required' : (isPurchasePolicySimulationLoading ? 'Validating withdraw' : isPurchasePolicyConfirming ? 'Sending withdraw request' : 'Confirm withdraw')))
                                                        }
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog> : <Button
                                            variant="default"
                                            size="sm"
                                            className="w-full mt-4"
                                            disabled={isInitialDepositConfirming || isInitialDepositSimulationLoading || isInitialDepositApprovalConfirming || assetsInUSDeLoading}
                                            onClick={onInitialDeposit}
                                        >
                                            {isInitialDepositConfirming || isInitialDepositSimulationLoading || isInitialDepositApprovalConfirming || assetsInUSDeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                                            {
                                                (isInitialDepositApprovalConfirming ? 'Requesting allowance' : (assetsInUSDeLoading ? 'Calculating USDe required' : (isInitialDepositSimulationLoading ? 'Validating deposit' : isInitialDepositConfirming ? 'Sending deposit' : 'Initialize')))
                                            }
                                        </Button>}
                                    </>
                                }
                                {
                                    (poolData?.insurer && userAddress !== getAddress(poolData?.insurer)) && <>
                                        {Number((policies ?? '0')) === 0 ? <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full mt-4"
                                                    disabled={Number(totalPolicies) === 0}
                                                >
                                                    Purchase Policy
                                                </Button>
                                            </DialogTrigger>
                                            <DialogOverlay className="fixed inset-0 bg-black/90 z-40" />
                                            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#161a1d] rounded-lg shadow-lg p-6 z-50 max-w-lg w-full">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl pb-4 font-semibold text-gray-900 dark:text-gray-100 text-center">{poolData?.poolName}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    {/* Informasi Pool */}
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Name:</Label>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{poolData?.poolName}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Symbol:</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.symbol}</p>
                                                    </div>

                                                    {/* Input Jumlah Policies */}
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Amount of Policies:</Label>
                                                        <TokenInput
                                                            max={poolData?.maxPolicies}
                                                            symbol={poolData?.symbol}
                                                            value={purchaseAmount}
                                                            onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                                                            className="mt-1"
                                                        />
                                                        <p>{purchaseAmount > 0 ? `Required balance: ${assetsInUSDe} USDe` : ''}</p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="w-full mt-4"
                                                        disabled={isPurchasePolicyConfirming || isPurchasePolicySimulationLoading || isPurchasePolicyApprovalConfirming || assetsInUSDeLoading}
                                                        onClick={onPurchase}
                                                    >
                                                        {isPurchasePolicyConfirming || isPurchasePolicySimulationLoading || isPurchasePolicyApprovalConfirming || assetsInUSDeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                                                        {
                                                            (isPurchasePolicyApprovalConfirming ? 'Requesting allowance' : (assetsInUSDeLoading ? 'Calculating USDe required' : (isPurchasePolicySimulationLoading ? 'Validating purchase' : isPurchasePolicyConfirming ? 'Purchasing policy' : 'Confirm purchase')))
                                                        }
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog> : <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full mt-4"
                                                >
                                                    Submit Claim
                                                </Button>
                                            </DialogTrigger>
                                            <DialogOverlay className="fixed inset-0 bg-black/90 z-40" />
                                            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#161a1d] rounded-lg shadow-lg p-6 z-50 max-w-lg w-full">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl pb-4 font-semibold text-gray-900 dark:text-gray-100 text-center">{poolData?.poolName}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Name:</Label>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{poolData?.poolName}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Symbol:</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.symbol}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Claim Fee:</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatTokenAmount(Number(poolData?.claimFee))} USDe</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Storage Fee:</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatTokenAmount(Number(storageFee))} USDe</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label className="font-medium text-md text-gray-700 dark:text-gray-300">Total Fee (Claim Fee + Storage Fee):</Label>
                                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatTokenAmount(Number(storageFee) + Number(poolData?.claimFee))} USDe</p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="w-full mt-4"
                                                        disabled={isSubmitClaimConfirming || isSubmitClaimSimulationLoading || isSubmitClaimApprovalConfirming || assetsInUSDeLoading}
                                                        onClick={onSubmitClaim}
                                                    >
                                                        {isSubmitClaimConfirming || isSubmitClaimSimulationLoading || isSubmitClaimApprovalConfirming || assetsInUSDeLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
                                                        {
                                                            (isSubmitClaimApprovalConfirming ? 'Requesting allowance' : (assetsInUSDeLoading ? 'Calculating USDe required' : (isSubmitClaimSimulationLoading ? 'Validating claim request' : isSubmitClaimConfirming ? 'Submitting claim' : 'Submit claim')))
                                                        }
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>}
                                    </>
                                }

                                {/* Alert Dialog */}
                                <AlertDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>The number of policies is invalid</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                The number of policies can be less than 0. Please enter the correct value.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction onClick={() => setIsPurchaseDialogOpen(false)}>
                                                OK
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                        </div>
                        {/* <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6"> */}

                        <div className="bg-gray-50 dark:bg-[#131313] p-4 rounded-lg shadow-inner">
                            <MDXViewer url={poolData?.descriptionUri ?? ''} />
                        </div>
                        {/* </div> */}

                        <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6 mt-5">
                            {/* cURL */}
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Label className="font-medium text-xl text-gray-700 dark:text-gray-300 font-bold mb-2">Request</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info size={14}className="ml-1 mb-1.5" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Displays the cURL command for the API request.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <CurlViewer curl={poolData?.curl} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6 mt-5">
                            {/* Regex Extraction */}
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Label className="font-medium text-xl mb-2 text-gray-700 dark:text-gray-300 font-bold">Regex Extraction</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info size={14}className="ml-1 mb-1.5" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>The regular expression used to extract specific data from the response (API).</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.regexExtraction}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6 mt-5">
                            {/* Regex Validation */}
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Label className="font-medium text-xl mb-2 text-gray-700 dark:text-gray-300 font-bold">Regex Validation</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info size={14}className="ml-1 mb-1.5" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>This regular expression is used to check whether the extracted value meets the requirement to be approved.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{poolData?.regexValidation}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#131313] p-6 rounded-lg shadow-md space-y-6 mt-5">
                            <div className="flex flex-col">
                                <Label className="font-medium text-2xl text-gray-700 dark:text-gray-300 font-bold">
                                    Example Response
                                </Label>
                                <Label className="font-medium text-md mb-2 text-gray-700 dark:text-gray-300 font-bold mt-1">
                                    Approved:
                                </Label>
                                <JSONPreviewer
                                    uri={poolData?.exampleResponseUri ?? ''}
                                    field={'approved'}
                                />
                                <Label className="font-medium text-md mb-2 text-gray-700 dark:text-white font-bold mt-1">
                                    Rejected:
                                </Label>
                                <JSONPreviewer
                                    uri={poolData?.exampleResponseUri ?? ''}
                                    field={'rejected'}
                                />
                            </div>
                        </div>
                        <div className="mt-10 w-full h-auto z-10">
                            <div className="flex gap-x-6 text-lg font-medium">
                                <button
                                    onClick={() => setActiveTab(PoolTableType.Purchase)}
                                    className={`pb-2 ${activeTab === PoolTableType.Purchase
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        }`}
                                >
                                    Policy Purchase History
                                </button>
                                <button
                                    onClick={() => setActiveTab(PoolTableType.Claim)}
                                    className={`pb-2 ${activeTab === PoolTableType.Claim
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        }`}
                                >
                                    Claim History
                                </button>
                            </div>
                            {activeTab === PoolTableType.Purchase &&
                                <DataTable
                                    data={
                                        policyPurchaseds?.policyPurchaseds ?? []
                                    }
                                    columns={policyPurchasedColumns()}
                                    handleRefresh={() => { }}
                                    isLoading={policyPurchasedsLoading}
                                />
                            }
                            {activeTab === PoolTableType.Claim &&
                                <DataTable
                                    data={
                                        submittedClaims ?? []
                                    }
                                    columns={claimSubmittedColumns()}
                                    handleRefresh={() => { }}
                                    isLoading={claimSubmittedsIsLoading}
                                />
                            }
                        </div>
                    </div>
                    <SuccessDialog
                        open={isPurchasePolicyAlertOpen}
                        onOpenChange={setIsPurchasePolicyAlertOpen}
                        txHash={purchasePolicyHash}
                        isLoading={isPurchasePolicyConfirming}
                    />
                    <SuccessDialog
                        open={isInitialDepositAlertOpen}
                        onOpenChange={setIsInitialDepositAlertOpen}
                        txHash={initialDepositHash}
                        isLoading={isInitialDepositConfirming}
                    />
                    <SuccessDialog
                        open={isSubmitClaimAlertOpen}
                        onOpenChange={setIsSubmitClaimAlertOpen}
                        txHash={submitClaimHash}
                        isLoading={isSubmitClaimConfirming}
                    />
                </div>
            </ClientWrapper>
        </main>
    );
};

export default PoolDetails;
