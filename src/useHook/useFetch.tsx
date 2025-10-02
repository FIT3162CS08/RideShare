// useHook/useFetch.tsx
"use client";
import { useEffect, useState } from "react";

export function useFetch<T = any>(url: string, opts?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let abort = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include", // <-- CRITICAL
          headers: { "Accept": "application/json" },
          ...opts,
        });

        if (!res.ok) {
          // surface 401s clearly
          if (res.status === 401) {
            setError("Not authenticated (401). Please log in.");
          } else {
            const text = await res.text();
            setError(text || `Request failed: ${res.status}`);
          }
          setData(null);
        } else {
          const json = await res.json();
          if (!abort) setData(json);
        }
      } catch (e: any) {
        if (!abort) setError(e?.message || "Network error");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => { abort = true; };
  }, [url]);

  return { data, setData, loading, error };
}