import { useRef, useEffect, useCallback } from "react"

type IntersectHandler = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void

const useIntersect = (
  onIntersect: IntersectHandler,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        onIntersect(entry, observer);
      });
    },
    [onIntersect],
  );

  useEffect(() => {
    if (!ref.current) return;

    observer.current = new IntersectionObserver(callback, options);
    observer.current.observe(ref.current);
    
    return () => {
      if(observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref, options, callback]);

  return { ref };
}

export default useIntersect;