import { useEffect } from 'react';
import { isFunction } from '../utils';
import { isLocal } from '../utils/is-local';

const useMount = (fn: () => void) => {
  if (isLocal) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`
      );
    }
  }

  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;
