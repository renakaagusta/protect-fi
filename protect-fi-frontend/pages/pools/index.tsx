import InsurePools from "@/components/chart/insure-pools";
import { DataTable } from "@/components/table/data-table";
import { poolCreatedColumns } from "@/components/table/insurance/pool-created/columns";
import ClientWrapper from "@/components/wrapper/client-wrapper";
import { INSURANCE_SUBGRAPH_URL } from "@/constants/subgraph-url";
import { queryPoolCreateds } from "@/graphql/insurance/insurance.query";
import { InsurancePoolCreateds } from "@/types/web3/insurance/pool-created";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { NextPage } from "next";
import { useState } from "react";
import { useAccount } from "wagmi";

const Pools: NextPage = () => {
    const { address: userAddress, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<"pools" | "transactions" | "tokens">("pools");

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

    return (
        <main>
            <ClientWrapper>
                <div className="w-full px-4 sm:px-6 lg:px-8 lg:w-[92vw] mx-auto">
                    {/* Insurance Pools Section */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 rounded-lg flex flex-col justify-center w-full">
                        <InsurePools />
                    </div>

                    {/* History Pools Tab */}
                    <div className="mt-8 sm:mt-10 lg:mt-12">
                        <div className="flex items-center">
                            <button
                                onClick={() => setActiveTab("pools")}
                                disabled
                                className={`pb-2 text-base sm:text-lg lg:text-2xl font-medium transition-colors duration-200 ${activeTab === "pools"
                                        ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                            >
                                History Pools
                            </button>
                        </div>
                    </div>

                    {/* Data Table Section */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 overflow-x-auto">
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
                    </div>
                </div>
            </ClientWrapper>
        </main>
    );
};

export default Pools;
