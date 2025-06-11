import { useEffect, useRef } from 'react';
import isDev from '../utils/isDev';

export type IProps = Record<string, any>;

const useWhyUpdate = (componentName: string, props: IProps): void => {
  const preProps = useRef<IProps>({});

  useEffect(() => {
    const keys = Object.keys({ ...preProps.current, ...props });
    const changedProps: IProps = {};

    keys.forEach((item) => {
      if (Object.is(preProps.current[item], props[item])) return;
      changedProps[item] = {
        from: preProps.current[item],
        to: props[item],
      };
    });

    if (isDev && Object.keys(changedProps).length)
      console.log('Which property caused update', componentName, changedProps);

    preProps.current = props;
  }, []);
};

export default useWhyUpdate;
