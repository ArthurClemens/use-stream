import type Debug from 'debug';
// eslint-disable-next-line import/no-unresolved
import React from 'react';

type DependencyList = ReadonlyArray<unknown>;

type TStream<T> = {
  (): T;
  (value: T): unknown;
  map<U>(f: (current: T) => U): TStream<U>;
  end: TStream<boolean>;
} & unknown;

interface IModel {
  [key: string]: TStream<unknown>;
}

type TMaybeDeferredModel<TModel> = TModel & {
  isDeferred?: boolean;
};

type TModelFn<TModel> = (_?: unknown) => TMaybeDeferredModel<TModel>;

type TModelGen<TModel> = TModel | TModelFn<TModel>;

type Props<TModel> = {
  /**
   * The model is a POJO object with (optionally multiple) streams.
   * `useStream` returns this model once it is initialized.
   *
   * Example:
   *
   * const model = useStream({
   *   model: {
   *     index: stream(0),
   *     count: stream(3)
   *   }
   * })
   *
   * const { index, count } = model
   *
   *
   * For more flexibility, pass a function that returns the model object. See also `defer`
   * how to combine this for optimization.
   *
   * Example:
   *
   * const { index, count } = useStream({
   *   model: () => {
   *     const index = stream(0)
   *     const count = stream(3)
   *     count.map(console.log) // another stream that is subscribed to the count stream
   *
   *     return {
   *       index,
   *       count
   *     }
   *   }
   * })
   */
  model: TModelGen<TModel>;

  /**
   * Callback method to run side effects when the containing component is mounted.
   */
  onMount?: (model: TModel) => unknown;

  /**
   * Callback method to run side effects when the containing component is updated through deps.
   */
  onUpdate?: (model: TModel) => unknown;

  /**
   * Callback method to clean up side effects. onDestroy is called
   * when the containing component goes out of scope.
   */
  onDestroy?: (model: TModel | null) => unknown;

  /**
   * React hooks deps array. Default [].
   */
  deps?: DependencyList;

  /**
   * Defers initialization of the model to the mount useEffect.
   */
  defer?: boolean;

  /**
   * Debugger instance.
   * See: https://www.npmjs.com/package/debug
   */
  debug?: Debug.Debugger;
};

export const useStream = <TModel>({
  model,
  onMount,
  onDestroy,
  onUpdate,
  deps = [],
  defer,
  debug,
}: Props<TModel>) => {
  // Local storage that connects stream updates to React renders:
  const [streamValues, setStreamValues] = React.useState<{
    [key: string]: unknown;
  }>({});

  // Distinguish update from mount:
  const isInitedRef = React.useRef(false);

  // Keep reference of all streams that update streamValues so they can be stopped:
  type TSubsRef = TStream<unknown>[];
  const subsRef: React.MutableRefObject<TSubsRef> = React.useRef<TSubsRef>([]);

  const subscribe = (memo: TMaybeDeferredModel<TModel>) => {
    if (debug) {
      debug('Subscribe');
    }
    subsRef.current = Object.keys(memo)
      .map((key: string) => {
        const stream: TStream<unknown> = (memo as TMaybeDeferredModel<TModel> &
          IModel)[key];
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
      subsRef.current.forEach((s: TStream<unknown>) => s.end(true));
      subsRef.current = [];
    }
  };

  const createMemo: () => TMaybeDeferredModel<TModel> = () => {
    if (debug) {
      debug('createMemo');
    }
    unsubscribe();
    const modelFn: TModelFn<TModel & IModel> =
      typeof model === 'function'
        ? (model as TModelFn<TModel & IModel>)
        : ((() => model) as TModelFn<TModel & IModel>);
    const memo = modelFn();
    subscribe(memo);
    return memo;
  };

  const [memo, setMemo] = React.useState<TMaybeDeferredModel<TModel>>(
    defer
      ? ({ ...model, isDeferred: true } as TMaybeDeferredModel<TModel>)
      : createMemo,
  );

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
