import { useEffect, useState } from "react";

/**
 * Ensures loading state stays true for at least `delay` ms
 */
export function useDelayedLoading(isLoading: boolean, delay = 400) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    let timeout: number;

    if (!isLoading) {
      // Delay turning off the loading state
      timeout = window.setTimeout(() => {
        setShowLoading(false);
      }, delay);
    } else {
      // If loading again, instantly show skeleton
      setShowLoading(true);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, delay]);

  return showLoading;
}
