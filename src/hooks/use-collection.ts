import { useCallback, useEffect, useState } from "react";
import { getCollection, retrySticker, type CollectionEntry } from "@/lib/loot.functions";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { supabase } from "@/integrations/supabase/client";

export function useCollection() {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!hasSupabaseConfig) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setEntries([]);
        return;
      }
      setEntries(await getCollection());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your collection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const retry = async (claimId: string) => {
    await retrySticker({ data: { claimId } });
    await refresh();
  };

  return { entries, loading, error, refresh, retry };
}
