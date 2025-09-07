"use client";

import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true; // prevent setting state on unmounted component

    setLoading(true);
    setError(null);

    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) setData(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

      return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, setData, loading, error };
}
