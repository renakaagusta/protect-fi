import InsuranceFactoryABI from "@/abis/insurance/InsuranceFactoryABI";
import { wagmiConfig } from "@/configs/wagmi";
import { INSURANCE_FACTORY } from "@/constants/contract-address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseStorageFeeOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseStorageFeeResult {
    storageFee: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshStorageFee: () => Promise<void>;
    isStale: boolean;
}

export const useStorageFee = (
    options: UseStorageFeeOptions = {}
): UseStorageFeeResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [storageFee, setStorageFee] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchStorageFee = useCallback(async () => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: INSURANCE_FACTORY,
                abi: InsuranceFactoryABI,
                functionName: 'storageFee',
                args: [],
            });

            setStorageFee(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch operator public key');

            setError(error);
            console.error('Error fetching M0 operator public key:', error);
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    const refreshStorageFee = useCallback(async () => {
        await fetchStorageFee();
    }, [fetchStorageFee]);

    useEffect(() => {
        setIsStale(true);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchStorageFee();
            intervalId = setInterval(() => {
                refreshStorageFee();
            }, 50000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchStorageFee, refreshStorageFee, enabled]);

    return {
        storageFee,
        loading,
        error,
        refreshStorageFee,
        isStale,
    };
};
