import IERC4626 from "@/abis/vault/IERC4626";
import { wagmiConfig } from "@/configs/wagmi";
import { STAKED_USDE_ADDRESS } from "@/constants/contract-address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseConvertToAssetsOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseConvertToAssetsResult {
    assets: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshConvertToAssets: () => Promise<void>;
    isStale: boolean;
}

export const useConvertToAssets = (
    shares: number, 
    options: UseConvertToAssetsOptions = {}
): UseConvertToAssetsResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [assets, setAssets] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchConvertToAssets = useCallback(async () => {
        if (!shares || !enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: STAKED_USDE_ADDRESS,
                abi: IERC4626,
                functionName: 'convertToAssets',
                args: [shares],
            });

            setAssets(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch operator public key');

            setError(error);
            console.error('Error fetching M0 operator public key:', error);
        } finally {
            setLoading(false);
        }
    }, [shares, enabled]);

    const refreshConvertToAssets = useCallback(async () => {
        await fetchConvertToAssets();
    }, [fetchConvertToAssets]);

    useEffect(() => {
        setIsStale(true);
    }, [shares]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchConvertToAssets();
            intervalId = setInterval(() => {
                refreshConvertToAssets();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchConvertToAssets, refreshConvertToAssets, enabled]);

    return {
        assets,
        loading,
        error,
        refreshConvertToAssets,
        isStale,
    };
};
