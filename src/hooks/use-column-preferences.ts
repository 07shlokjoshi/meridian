"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COLUMN_STORAGE_KEY,
  DEFAULT_COLUMNS,
  REORDERABLE_COLUMNS,
} from "@/lib/constants";
import type { ColumnConfig, ProductColumnId } from "@/types/product";

function loadColumns(): ColumnConfig[] {
  if (typeof window === "undefined") return DEFAULT_COLUMNS;

  try {
    const raw = localStorage.getItem(COLUMN_STORAGE_KEY);
    if (!raw) return DEFAULT_COLUMNS;
    const parsed = JSON.parse(raw) as ColumnConfig[];
    const defaults = new Map(DEFAULT_COLUMNS.map((c) => [c.id, c]));
    const merged = parsed
      .map((col) => {
        const base = defaults.get(col.id);
        if (!base) return null;
        return { ...base, ...col };
      })
      .filter((col): col is ColumnConfig => col !== null);
    return merged.length > 0 ? merged : DEFAULT_COLUMNS;
  } catch {
    return DEFAULT_COLUMNS;
  }
}

export function useColumnPreferences() {
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setColumns(loadColumns());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ColumnConfig[]) => {
    setColumns(next);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleColumn = useCallback(
    (id: ProductColumnId) => {
      persist(
        columns.map((col) =>
          col.id === id ? { ...col, visible: !col.visible } : col
        )
      );
    },
    [columns, persist]
  );

  const reorderColumns = useCallback(
    (activeId: ProductColumnId, overId: ProductColumnId) => {
      const reorderable = columns.filter((c) =>
        REORDERABLE_COLUMNS.includes(c.id)
      );
      const oldIndex = reorderable.findIndex((c) => c.id === activeId);
      const newIndex = reorderable.findIndex((c) => c.id === overId);
      if (oldIndex < 0 || newIndex < 0) return;

      const nextReorderable = [...reorderable];
      const [moved] = nextReorderable.splice(oldIndex, 1);
      nextReorderable.splice(newIndex, 0, moved);

      const actionsCol = columns.find((c) => c.id === "actions")!;
      persist([...nextReorderable, actionsCol]);
    },
    [columns, persist]
  );

  const resetColumns = useCallback(() => {
    persist(DEFAULT_COLUMNS);
  }, [persist]);

  const visibleColumns = columns.filter((c) => c.visible);

  return {
    columns,
    visibleColumns,
    hydrated,
    toggleColumn,
    reorderColumns,
    resetColumns,
  };
}
