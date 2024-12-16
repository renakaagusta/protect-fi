import { PoolData } from "@/components/pool-chart/pool-chart";
import { DataHistoryBuy } from "@/components/table/data-history-buy";
import { DataHistoryClaim } from "@/components/table/data-history-claim";
import { DataTable } from "@/components/table/data-table";
import { requestTokenColumns } from "@/components/table/faucet/request-token/columns";
import { poolCreatedColumns } from "@/components/table/insurance/pool-created/columns";
import ClientWrapper from "@/components/wrapper/client-wrapper";
import { FAUCET_SUBGRAPH_URL, INSURANCE_SUBGRAPH_URL } from "@/constants/subgraph-url";
import { queryRequestTokens } from "@/graphql/faucet/faucet.query";
import { queryPoolCreateds } from "@/graphql/insurance/insurance.query";
// import { queryPolicyPurchaseds, queryPoolCreatedsByPool } from "@/graphql/insurance/insurance.query";
import { RequestTokensData } from "@/types/web3/faucet/request-token";
import { PolicyPurchaseds } from "@/types/web3/insurance/policy-purchased";
import PoolCreated, { InsurancePoolCreateds } from "@/types/web3/insurance/pool-created";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";


const History: NextPage = () => {
    const router = useRouter();
    const { address: poolAddress } = router.query;
    const { address: userAddress, isConnected } = useAccount();

    const [poolData, setPoolData] = useState<PoolCreated>();
    const [currentPoolShares, setCurrentPoolShares] = useState<PoolData[]>([]);
    const [projectionPoolShares, setProjectionPoolShares] = useState<PoolData[]>([]);

    const [activeTab, setActiveTab] = useState<"claim" | "buy" | "pools">("pools");

    const { data: poolCreateds, isLoading: poolCreatedsLoading, refetch: poolCreatedsRefetch } = useQuery<InsurancePoolCreateds>({
        queryKey: ['poolCreateds'],
        queryFn: async () => {
            return await request(INSURANCE_SUBGRAPH_URL, queryPoolCreateds);
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
    });

    // const { data: policyPurchaseds, isLoading: policyPurchasedsLoading, refetch: policyPurchasedsRefetch } = useQuery<PolicyPurchaseds>({
    //     queryKey: ['queryPolicyPurchaseds', poolAddress],
    //     queryFn: async () => {
    //         return await request(INSURANCE_SUBGRAPH_URL, queryPolicyPurchaseds, { pool: poolAddress });
    //     },
    //     staleTime: Infinity,
    //     refetchOnWindowFocus: false,
    //     refetchOnMount: false,
    //     refetchOnReconnect: false,
    //     retry: false,
    //     enabled: poolAddress !== undefined
    // });

    const { data: requestTokensData, isLoading: requestTokensIsLoading, refetch: requestTokensRefetch } = useQuery<RequestTokensData>({
        queryKey: ['requestTokensData'],
        queryFn: async () => {
            return await request(FAUCET_SUBGRAPH_URL, queryRequestTokens);
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
    });

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

    // useEffect(() => {
    //     if (!poolData || !policyPurchaseds) {
    //         return;
    //     }

    //     setCurrentPoolShares([{
    //         label: 'Insurer',
    //         value: Number(poolData.benefit) * Number(poolData.maxPolicies)
    //     },
    //     ...policyPurchaseds.policyPurchaseds.map((policyPurchased) => ({
    //         label: policyPurchased.insured,
    //         value: Number(policyPurchased.shares),
    //     }))
    //     ])
    // }, [poolData, policyPurchaseds])


    return (
        // <main>
        <ClientWrapper>
            <div className="min-h-screen rounded-lg p-4 w-full lg:px-[5vw] mx-auto">
                <div className="flex flex-col">
                    {/* Header - Now positioned at top */}
                    <div className="pt-[5rem] flex justify-center items-center mb-10">
                        <div>
                            <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-600/80 bg-clip-text text-center text-4xl sm:text-5xl lg:text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-500/50">
                                History
                            </h1>
                            <p className="text-base sm:text-lg text-gray-500 mt-2 text-center">
                                Explore all the activities in this protocol.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full space-y-2 h-auto z-10">
                        {/* Tabs */}
                        <div className="flex gap-x-4 sm:gap-x-6 text-base sm:text-lg font-medium overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveTab("pools")}
                                className={`pb-2 whitespace-nowrap ${activeTab === "pools"
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                Pools
                            </button>
                            <button
                                onClick={() => setActiveTab("claim")}
                                className={`pb-2 whitespace-nowrap ${activeTab === "claim"
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                History Claim
                            </button>
                            <button
                                onClick={() => setActiveTab("buy")}
                                className={`pb-2 whitespace-nowrap ${activeTab === "buy"
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                History Buy
                            </button>
                        </div>

                        {/* Tables */}
                        <div className="mt-4">
                            {activeTab === "pools" && (
                                <DataTable
                                    data={poolCreateds?.insurancePoolCreateds ?? []}
                                    clickable={true}
                                    destinationData="pools"
                                    destinationField="poolAddress"
                                    columns={poolCreatedColumns()}
                                    handleRefresh={poolCreatedsRefetch}
                                    isLoading={poolCreatedsLoading}
                                />
                            )}

                            {activeTab === "claim" && (
                                <DataHistoryClaim
                                    data={requestTokensData?.requestTokens ?? []}
                                    columns={requestTokenColumns()}
                                    handleRefresh={() => { }}
                                    isLoading={requestTokensIsLoading}
                                />
                            )}

                            {activeTab === "buy" && (
                                <DataHistoryBuy
                                    data={requestTokensData?.requestTokens ?? []}
                                    columns={requestTokenColumns()}
                                    handleRefresh={() => { }}
                                    isLoading={requestTokensIsLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ClientWrapper>
        // </main>
    )
}

export default History