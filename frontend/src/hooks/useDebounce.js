import { useState, useEffect } from "react";

/**
 * Debounce Hook - delays value updates
 * @param {any} value - value to debounce
 * @param {number} delay - delay time in milliseconds
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel previous timer when value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
