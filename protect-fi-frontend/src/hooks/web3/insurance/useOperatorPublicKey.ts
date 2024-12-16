import InsuranceServiceManagerABI from "@/abis/insurance/InsuranceServiceManagerABI";
import { wagmiConfig } from "@/configs/wagmi";
import { INSURANCE_SERVICE_MANAGER } from "@/constants/contract-address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseOperatorPublicKeyOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseOperatorPublicKeyResult {
    operatorPublicKey: string | undefined;
    loading: boolean;
    error: Error | null;
    refreshOperatorPublicKey: () => Promise<void>;
    isStale: boolean;
}

export const useOperatorPublicKey = (
    options: UseOperatorPublicKeyOptions = {}
): UseOperatorPublicKeyResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [operatorPublicKey, setOperatorPublicKey] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchOperatorPublicKey = useCallback(async () => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: INSURANCE_SERVICE_MANAGER,
                abi: InsuranceServiceManagerABI,
                functionName: 'operatorPublicKey',
                args: [],
            });

            setOperatorPublicKey(result as string);
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

    const refreshOperatorPublicKey = useCallback(async () => {
        await fetchOperatorPublicKey();
    }, [fetchOperatorPublicKey]);

    useEffect(() => {
        setIsStale(true);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchOperatorPublicKey();
            intervalId = setInterval(() => {
                refreshOperatorPublicKey();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchOperatorPublicKey, refreshOperatorPublicKey, enabled]);

    return {
        operatorPublicKey,
        loading,
        error,
        refreshOperatorPublicKey,
        isStale,
    };
};
