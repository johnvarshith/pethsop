import { useState, useEffect } from 'react';

/**
 * Debounces a value — waits `delay` ms after the last change before updating.
 * Standard pattern for search inputs to avoid hammering the API.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
