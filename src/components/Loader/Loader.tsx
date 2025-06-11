import React from "react";
import { debounce } from "throttle-debounce";
import { isNumber } from "../../utils/isType";
import styles from "./Loader.module.scss";

export enum LoaderSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGER = "large",
}

interface ILoaderProps {
  loading: boolean;
  size?: LoaderSize;
  className?: string;
  delay?: number; // milliseconds
  children?: React.ReactNode;
}

const Loader: React.FC<ILoaderProps> = (props: ILoaderProps) => {
  const { loading, size, className, delay = 0, children } = props;
  const [spinning, setSpinning] = React.useState<boolean>(
    () => loading && !shouldDelay(loading, delay)
  );

  React.useEffect(() => {
    if (!delay) {
      setSpinning(loading);
      return;
    }
    const updateSpinning = debounce(delay, () => {
      setSpinning(loading);
    });
    updateSpinning();
    return () => {
      updateSpinning?.cancel?.();
    };
  }, [delay, loading]);

  const loadingView = React.useMemo(() => {
    const cls = `${styles.loaderView} ${className}`;
    // need loader svg component
    return <div className={cls}>Loading</div>;
  }, [loading, className, size]);

  return (
    <section className={styles.loader}>
      {spinning && loadingView}
      {children}
    </section>
  );
};

const shouldDelay = (spinning?: boolean, delay?: number): boolean => {
  return !!spinning && !!delay && isNumber(Number(delay));
};

export default Loader;
