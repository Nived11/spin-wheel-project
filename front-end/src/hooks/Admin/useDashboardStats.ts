import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { extractErrorMessages } from "../../utils/extractErrorMessages";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasFetchedRef = useRef(false);

  const fetchStats = async (forceRefetch = false) => {
    // Skip if already fetched
    if (hasFetchedRef.current && !forceRefetch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/stats");
      setStats(res.data);
      hasFetchedRef.current = true;
    } catch (err: any) {
      const message = extractErrorMessages(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { 
    stats, 
    loading, 
    error, 
    refetch: () => fetchStats(true) 
  };
};
