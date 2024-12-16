import ERC20ABI from "@/abis/tokens/IDRTABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseTotalSupplyOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseTotalSupplyResult {
    totalSupply: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshTotalSupply: () => Promise<void>;
    isStale: boolean;
}

export const useTotalSupply = (
    tokenAddress: HexAddress,
    options: UseTotalSupplyOptions = {}
): UseTotalSupplyResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [totalSupply, setTotalSupply] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchTotalSupply = useCallback(async () => {
        if (!tokenAddress || !enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: tokenAddress,
                abi: ERC20ABI,
                functionName: 'totalSupply',
                args: [],
            });

            setTotalSupply(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch totalSupply');

            setError(error);
            console.error('Error fetching M0 totalSupply:', error);
        } finally {
            setLoading(false);
        }
    }, [tokenAddress, enabled]);

    const refreshTotalSupply = useCallback(async () => {
        await fetchTotalSupply();
    }, [fetchTotalSupply]);

    useEffect(() => {
        setIsStale(true);
    }, [tokenAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchTotalSupply();
            intervalId = setInterval(() => {
                refreshTotalSupply();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchTotalSupply, refreshTotalSupply, enabled]);

    return {
        totalSupply,
        loading,
        error,
        refreshTotalSupply,
        isStale,
    };
};
