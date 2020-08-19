// eslint-disable-next-line import/no-unresolved
import React from 'react';
import { UseStream } from '../index';

export const useStream = <TModel>({
  model,
  onMount,
  onDestroy,
  onUpdate,
  deps = [],
  defer,
  debug,
}: UseStream.UseStreamProps<TModel>) => {
  // Local storage that connects stream updates to React renders:
  const [streamValues, setStreamValues] = React.useState<{
    [key: string]: unknown;
  }>({});

  // Distinguish update from mount:
  const isInitedRef = React.useRef(false);

  // Keep reference of all streams that update streamValues so they can be stopped:
  type TSubsRef = UseStream.TStream<unknown>[];
  const subsRef: React.MutableRefObject<TSubsRef> = React.useRef<TSubsRef>([]);

  const subscribe = (memo: TModel) => {
    if (debug) {
      debug('Subscribe');
    }
    subsRef.current = Object.keys(memo)
      .map((key: string) => {
        const stream: UseStream.TStream<unknown> = (memo as TModel &
          UseStream.Model)[key];
        if (stream.map && typeof stream.map === 'function') {
          return stream.map((value: unknown) => {
            if (debug) {
              debug('Will update %s', key);
            }
            setStreamValues({
              ...streamValues,
              [key]: value,
            });
            return null;
          });
        }
        return false;
      })
      .filter(Boolean) as TSubsRef;
  };

  const unsubscribe = () => {
    if (subsRef.current.length) {
      if (debug) {
        debug('Unsubscribe');
      }
      subsRef.current.forEach((s: UseStream.TStream<unknown>) => s.end(true));
      subsRef.current = [];
    }
  };

  const createMemo: () => TModel = () => {
    if (debug) {
      debug('createMemo');
    }
    unsubscribe();
    const modelFn: UseStream.TModelFn<TModel & UseStream.Model> =
      typeof model === 'function'
        ? (model as UseStream.TModelFn<TModel & UseStream.Model>)
        : ((() => model) as UseStream.TModelFn<TModel & UseStream.Model>);
    const memo = modelFn();
    subscribe(memo);
    return memo;
  };

  const [memo, setMemo] = React.useState(defer ? null : createMemo);

  // Update
  React.useEffect(() => {
    if (!isInitedRef.current) {
      return;
    }
    if (debug) {
      debug('Updating');
    }
    if (onUpdate) {
      const localMemo = createMemo();
      setMemo(localMemo);
      onUpdate(localMemo);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount and unmount
  React.useEffect(() => {
    if (debug) {
      debug('Mounting');
    }

    let localMemo = memo;
    if (defer) {
      localMemo = createMemo();
      setMemo(localMemo);
    }
    if (onMount && localMemo) {
      onMount(localMemo);
    }
    isInitedRef.current = true;

    return () => {
      if (debug) {
        debug('Unmounting');
      }
      unsubscribe();
      if (onDestroy) {
        onDestroy(memo);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return memo;
};
