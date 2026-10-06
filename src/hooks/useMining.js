import { useCallback, useEffect, useState } from "react";

import miningService from "../services/api/miningService";

const useMining = () => {
  const [status, setStatus] = useState(null);
  const [activeSession, setActiveSession] =
    useState(null);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState(null);

  const loadMiningData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusResponse, sessionResponse] =
        await Promise.all([
          miningService.getMiningStatus(),
          miningService.getActiveMiningSession(),
        ]);

      setStatus(
        statusResponse?.data || statusResponse || null
      );

      setActiveSession(
        sessionResponse?.data ||
          sessionResponse ||
          null
      );
    } catch (loadError) {
      console.error(
        "Failed to load mining data:",
        loadError
      );

      setError(
        loadError?.message ||
          "Failed to load mining data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMiningHistory = useCallback(
    async (limit = 20) => {
      try {
        const response =
          await miningService.getMiningHistory(limit);

        const historyData =
          response?.data ||
          response?.history ||
          [];

        setHistory(
          Array.isArray(historyData)
            ? historyData
            : []
        );

        return historyData;
      } catch (historyError) {
        console.error(
          "Failed to load mining history:",
          historyError
        );

        setError(
          historyError?.message ||
            "Failed to load mining history."
        );

        return [];
      }
    },
    []
  );

  const startMining = useCallback(async () => {
    try {
      setActionLoading(true);
      setError(null);

      const response =
        await miningService.startMining();

      await loadMiningData();

      return response;
    } catch (startError) {
      console.error(
        "Failed to start mining:",
        startError
      );

      setError(
        startError?.message ||
          "Failed to start mining."
      );

      throw startError;
    } finally {
      setActionLoading(false);
    }
  }, [loadMiningData]);

  const claimMiningReward =
    useCallback(async () => {
      try {
        setActionLoading(true);
        setError(null);

        const response =
          await miningService.claimMiningReward();

        await loadMiningData();
        await loadMiningHistory();

        return response;
      } catch (claimError) {
        console.error(
          "Failed to claim mining reward:",
          claimError
        );

        setError(
          claimError?.message ||
            "Failed to claim mining reward."
        );

        throw claimError;
      } finally {
        setActionLoading(false);
      }
    }, [loadMiningData, loadMiningHistory]);

  useEffect(() => {
    loadMiningData();
    loadMiningHistory();
  }, [loadMiningData, loadMiningHistory]);

  return {
    status,
    activeSession,
    history,
    loading,
    actionLoading,
    error,
    loadMiningData,
    loadMiningHistory,
    startMining,
    claimMiningReward,
  };
};

export default useMining;
