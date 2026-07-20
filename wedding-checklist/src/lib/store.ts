"use client";

import { useState, useEffect, useCallback } from "react";
import { ChecklistData, ItemDetail } from "@/types/checklist";
import { defaultCategories } from "@/lib/data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const STORAGE_KEY = "wedding-checklist-data";

async function loadFromSupabase(userId: string): Promise<ChecklistData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("checklist")
    .select("data")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data.data as ChecklistData;
}

async function saveToSupabase(userId: string, data: ChecklistData): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("checklist").upsert(
    { user_id: userId, data, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) console.error("Supabase save error:", error);
}

function loadFromLocalStorage(): ChecklistData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChecklistData;
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: ChecklistData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useChecklist() {
  const { user } = useAuth();
  const [data, setData] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function init() {
      let loaded = null;
      if (isSupabaseConfigured) {
        loaded = await loadFromSupabase(user!.id);
      }
      if (!loaded) {
        loaded = loadFromLocalStorage();
      }
      if (!loaded) {
        loaded = { categories: defaultCategories, lastModified: new Date().toISOString() };
      }
      setData(loaded);
      setLoading(false);
    }
    init();
  }, [user]);

  const save = useCallback(
    async (newData: ChecklistData) => {
      setData(newData);
      saveToLocalStorage(newData);
      if (isSupabaseConfigured && user) {
        await saveToSupabase(user.id, newData);
      }
    },
    [user]
  );

  const toggleItem = useCallback(
    async (categoryId: string, itemId: string) => {
      if (!data) return;
      const updated: ChecklistData = {
        ...data,
        lastModified: new Date().toISOString(),
        categories: data.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          };
        }),
      };
      await save(updated);
    },
    [data, save]
  );

  const updateItemDetails = useCallback(
    async (categoryId: string, itemId: string, details: ItemDetail) => {
      if (!data) return;
      const updated: ChecklistData = {
        ...data,
        lastModified: new Date().toISOString(),
        categories: data.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, details } : item
            ),
          };
        }),
      };
      await save(updated);
    },
    [data, save]
  );

  const getProgress = useCallback(() => {
    if (!data) return { total: 0, checked: 0, percentage: 0 };
    let total = 0;
    let checked = 0;
    data.categories.forEach((cat) => {
      total += cat.items.length;
      checked += cat.items.filter((i) => i.checked).length;
    });
    return { total, checked, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
  }, [data]);

  return { data, loading, toggleItem, updateItemDetails, getProgress };
}
