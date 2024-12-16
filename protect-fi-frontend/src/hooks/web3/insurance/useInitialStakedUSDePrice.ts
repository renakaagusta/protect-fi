import InsurancePoolABI from "@/abis/insurance/InsurancePoolABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseInitialStakedUSDePriceOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseInitialStakedUSDePriceResult {
    initialStakedUSDePrice: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshInitialStakedUSDePrice: () => Promise<void>;
    isStale: boolean;
}

export const useInitialStakedUSDePrice = (
    poolAddress: HexAddress, 
    options: UseInitialStakedUSDePriceOptions = {}
): UseInitialStakedUSDePriceResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [initialStakedUSDePrice, setInitialStakedUSDePrice] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchInitialStakedUSDePrice = useCallback(async () => {
        if (!poolAddress || !enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: poolAddress,
                abi: InsurancePoolABI,
                functionName: 'initialStakedUSDePrice',
                args: [],
            });

            setInitialStakedUSDePrice(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch operator public key');

            setError(error);
            console.error('Error fetching M0 operator public key:', error);
        } finally {
            setLoading(false);
        }
    }, [poolAddress, enabled]);

    const refreshInitialStakedUSDePrice = useCallback(async () => {
        await fetchInitialStakedUSDePrice();
    }, [fetchInitialStakedUSDePrice]);

    useEffect(() => {
        setIsStale(true);
    }, [poolAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchInitialStakedUSDePrice();
            intervalId = setInterval(() => {
                refreshInitialStakedUSDePrice();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchInitialStakedUSDePrice, refreshInitialStakedUSDePrice, enabled]);

    return {
        initialStakedUSDePrice,
        loading,
        error,
        refreshInitialStakedUSDePrice,
        isStale,
    };
};
