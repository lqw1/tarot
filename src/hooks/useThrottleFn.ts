import throttle from 'lodash/throttle';
import { useMemo } from 'react';
import isDev from '../utils/isDev';
import { isFunction } from '../utils/isType';
import useLatest from './useLatest';
import useUnmount from './useUnmount';

interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type noop = (...args: any[]) => any;

export default function useThrottleFn<T extends noop>(
  fn: T,
  options?: ThrottleOptions
) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useThrottleFn expected parameter is a function, got ${typeof fn}`
      );
    }
  }

  const fnRef = useLatest(fn);
  const wait = options?.wait ?? 1000;
  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options
      ),
    []
  );

  useUnmount(() => {
    throttled.cancel();
  });

  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush,
  };
}
