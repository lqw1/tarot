import { useCallback, useRef } from 'react';

// Add lock to an async function to prevent parallel executions.

export default function useLockFn<P extends any[] = any[], V = any>(
  fn: (...args: P) => Promise<V>
) {
  const lockRef = useRef(false);
  return useCallback(
    async (...args: P) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try {
        const ret = await fn(...args);
        lockRef.current = false;
        return ret;
      } catch (e) {
        lockRef.current = false;
        throw e;
      }
    },
    [fn]
  );
}
