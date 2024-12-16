import InsuranceFactoryABI from "@/abis/insurance/InsuranceFactoryABI";
import { wagmiConfig } from "@/configs/wagmi";
import { INSURANCE_FACTORY } from "@/constants/contract-address";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseServiceManagerAddressOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseServiceManagerAddressResult {
    serviceManagerAddress?: HexAddress;
    loading: boolean;
    error: Error | null;
    refreshServiceManagerAddress: () => Promise<void>;
    isStale: boolean;
}

export const useServiceManagerAddress = (
    options: UseServiceManagerAddressOptions = {}
): UseServiceManagerAddressResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [serviceManagerAddress, setServiceManagerAddress] = useState<HexAddress>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchServiceManagerAddress = useCallback(async () => {
        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: INSURANCE_FACTORY,
                abi: InsuranceFactoryABI,
                functionName: 'serviceManager',
                args: [],
            });

            setServiceManagerAddress(result as HexAddress);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch service manager');

            setError(error);
            console.error('Error fetching M0 service manager:', error);
        } finally {
            setLoading(false);
        }
    }, [serviceManagerAddress, enabled]);

    const refreshServiceManagerAddress = useCallback(async () => {
        await fetchServiceManagerAddress();
    }, [fetchServiceManagerAddress]);

    useEffect(() => {
        setIsStale(true);
    }, [serviceManagerAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchServiceManagerAddress();
            intervalId = setInterval(() => {
                refreshServiceManagerAddress();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchServiceManagerAddress, refreshServiceManagerAddress, enabled]);

    return {
        serviceManagerAddress,
        loading,
        error,
        refreshServiceManagerAddress,
        isStale,
    };
};
