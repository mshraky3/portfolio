import { useCallback, useEffect, useState } from "react";

/**
 * Target/Skip marks for a research page, persisted to localStorage.
 *
 * Keeps the exact storage shape the original standalone pages used
 * ({ [id]: "target" | "skip" }) so existing marks in the browser survive
 * the move into the SPA.
 */
export function useMarks(storageKey) {
  const [marks, setMarks] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(marks));
    } catch {
      /* private mode / quota — marks just won't persist */
    }
  }, [storageKey, marks]);

  // Clicking the active state again clears it, matching the original pages.
  const toggle = useCallback((id, value) => {
    setMarks((prev) => {
      const next = { ...prev };
      if (next[id] === value) delete next[id];
      else next[id] = value;
      return next;
    });
  }, []);

  const reset = useCallback(() => setMarks({}), []);

  return { marks, toggle, reset };
}

/** Writes to the clipboard, reporting whether it landed. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
