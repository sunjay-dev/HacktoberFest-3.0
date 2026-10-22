"use client";

import { useEffect, useState } from "react";
import { api, type Gig } from "@/lib/api";

export function useDiscoverGigs(refreshKey: unknown) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [payment, setPayment] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [mode, setMode] = useState("All gigs");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query.trim()) params.q = query.trim();
    if (category !== "all") params.category = category;
    if (payment !== "all") params.payment_type = payment;
    if (mode !== "All gigs") params.type = mode;
    if (minBudget) params.min_budget = minBudget;
    if (maxBudget) params.max_budget = maxBudget;

    let cancelled = false;
    api
      .gigs(params)
      .then((g) => {
        if (!cancelled) {
          setGigs(g);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGigs([]);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, category, payment, mode, minBudget, maxBudget, refreshKey]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    payment,
    setPayment,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    mode,
    setMode,
    gigs,
    ready,
  };
}
