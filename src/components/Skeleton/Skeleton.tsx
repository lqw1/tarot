import classNames from "classnames";
import React from "react";
import styles from "./Skeleton.module.scss";

interface ISkeleton {
  active?: boolean; // if show animation
  loading?: boolean; // true: show holder, false: show children content
  className?: string; // override component class
  children?: React.ReactNode;
  paragraphRow?: number; // the number of paragraph
}

const Skeleton: React.FC<ISkeleton> = ({
  active,
  loading,
  paragraphRow,
  className,
  children,
}) => {
  const { skeleton, title, paragraph, active: activeCls } = styles;

  const skeletonView = React.useMemo(() => {
    const skeletonCls = classNames(skeleton, className, {
      [activeCls]: active,
    });

    const paragraphs = new Array(paragraphRow).fill(null).map((item, index) => {
      const width = (index + 1) % 2 ? "100%" : "60%";
      return <div key={index} className={paragraph} style={{ width }} />;
    });

    return (
      <div className={skeletonCls}>
        <div className={title}></div>
        {paragraphs}
      </div>
    );
  }, [active, paragraphRow, className]);
  return (
    <>
      {!!loading && skeletonView}
      {!loading && children}
    </>
  );
};

Skeleton.defaultProps = {
  active: true,
  paragraphRow: 3,
  loading: true,
};

export default Skeleton;
