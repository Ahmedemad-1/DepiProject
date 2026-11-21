// HOOK   : useMenu()
// PURPOSE: loads the menu (all dishes + categories) ONCE through services/api.js and
//          keeps it in memory, so Home, Menu and the showcase do not refetch.
// RETURNS: { items, categories, loading, error, reload, categoryName(id) }
// NOTE   : Kept from Velora's useDishes hook; the data now comes from the API
//          (getMenuItems, getCategories) instead of hard-coded files.
import { useCallback, useEffect, useState } from "react";
import { getCategories, getMenuItems } from "../services/api.js";

let cache = null;

export function useMenu() {
  const [state, setState] = useState(() => ({
    items: cache?.items || [],
    categories: cache?.categories || [],
    loading: !cache,
    error: null,
  }));

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.all([getMenuItems(), getCategories()])
      .then(([items, categories]) => {
        cache = { items, categories };
        setState({ items, categories, loading: false, error: null });
      })
      .catch((e) =>
        setState({
          items: [],
          categories: [],
          loading: false,
          error: e.message,
        }),
      );
  }, []);

  useEffect(() => {
    if (!cache) load();
  }, [load]);

  const categoryName = (id) =>
    state.categories.find((c) => c.id === id)?.name || "";

  return { ...state, reload: load, categoryName };
}
