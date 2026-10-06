import { useCallback, useEffect, useState } from "react";

import balanceService from "../services/api/balanceService";

const useBalance = () => {
  const [balances, setBalances] = useState({
    snj: 0,
    nToken: 0,
    dollar: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBalances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await balanceService.getBalances();

      const data =
        response?.data ||
        response?.balances ||
        response ||
        {};

      setBalances({
        snj: Number(
          data?.snj ??
            data?.SNJ ??
            data?.snjBalance ??
            0
        ),
        nToken: Number(
          data?.nToken ??
            data?.NToken ??
            data?.nTokenBalance ??
            0
        ),
        dollar: Number(
          data?.dollar ??
            data?.USD ??
            data?.dollarBalance ??
            0
        ),
      });

      return data;
    } catch (balanceError) {
      console.error(
        "Failed to load balances:",
        balanceError
      );

      setError(
        balanceError?.message ||
          "Failed to load balances."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalances = useCallback(async () => {
    return loadBalances();
  }, [loadBalances]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return {
    balances,
    snjBalance: balances.snj,
    nTokenBalance: balances.nToken,
    dollarBalance: balances.dollar,
    loading,
    error,
    loadBalances,
    refreshBalances,
  };
};

export default useBalance;
