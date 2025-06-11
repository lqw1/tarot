import { useRef } from 'react';

function useLatest<T>(e: T) {
  const ref = useRef(e);
  ref.current = e;
  return ref;
}

export default useLatest;
