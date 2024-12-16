import InsurancePoolABI from "@/abis/insurance/InsurancePoolABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UsePreviewMintInUSDeOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UsePreviewMintInUSDeResult {
    assetsInUSDe: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshPreviewMintInUSDe: () => Promise<void>;
    isStale: boolean;
}

export const usePreviewMintInUSDe = (
    poolAddress: HexAddress, 
    shares: number,
    options: UsePreviewMintInUSDeOptions = {}
): UsePreviewMintInUSDeResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [assetsInUSDe, setAssetsInUSDe] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchPreviewMintInUSDe = useCallback(async () => {
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
                functionName: 'previewMintInUSDe',
                args: [shares],
            });
            setAssetsInUSDe(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch operator public key');

            setError(error);
            console.error('Error fetching M0 operator public key:', error);
        } finally {
            setLoading(false);
        }
    }, [poolAddress, shares, enabled]);

    const refreshPreviewMintInUSDe = useCallback(async () => {
        await fetchPreviewMintInUSDe();
    }, [fetchPreviewMintInUSDe]);

    useEffect(() => {
        setIsStale(true);
    }, [poolAddress, shares]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchPreviewMintInUSDe();
            intervalId = setInterval(() => {
                refreshPreviewMintInUSDe();
            }, 50000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchPreviewMintInUSDe, refreshPreviewMintInUSDe, enabled]);

    return {
        assetsInUSDe,
        loading,
        error,
        refreshPreviewMintInUSDe,
        isStale,
    };
};
