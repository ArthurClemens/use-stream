import { useEffect, useState, useRef } from "react";
import { UseStream } from "../index";

export const useStream = <TModel>({
  model,
  onMount,
  onDestroy,
  onUpdate,
  deps = [],
  debug,
} : UseStream.UseStreamProps<TModel & UseStream.IModel>) => {
    
  // Local storage that connects stream updates to React renders:
  const [streamValues, setStreamValues] = useState<{ [key: string]: any }>({});

  // Distinguish update from mount:
  const isInitedRef = useRef(false);
  
  // Keep reference of all streams that update streamValues so they can be stopped:
  const subsRef: React.MutableRefObject<UseStream.TStream[]> = useRef<UseStream.TStream[]>([]);

  const subscribe = (memo: TModel) => {
    debug && debug("Subscribe");
    subsRef.current = Object.keys(memo)
      .map((key: string) => {
        const stream: UseStream.TStream = (memo as TModel & UseStream.IModel)[key];
        return stream.map && typeof stream.map === "function"
          ? stream.map((value: any) => {
              debug && debug("Will update %s", key);
              setStreamValues({
                ...streamValues,
                [key]: value
              });
              return null;
            })
          : null;
      })
      .filter(Boolean);
  };

  const unsubscribe = () => {
    if (subsRef.current) {
      debug && debug("Unsubscribe");
      subsRef.current.forEach((s: UseStream.TStream) => s.end(true));
      subsRef.current = [];
    }
  };

  const memoGen: () => TModel = () => {
    debug && debug("memoGen");
    unsubscribe();
    const modelFn: UseStream.TModelFn<TModel> =
      typeof model === "function"
        ? (model as UseStream.TModelFn<TModel>)
        : ((() => model) as UseStream.TModelFn<TModel>);
    const memo = modelFn();
    subscribe(memo);
    return memo;
  };

  const [memo, setMemo] = useState(memoGen);

  // Update
  useEffect(() => {
    if (!isInitedRef.current) {
      return;
    }
    debug && debug("Updating");
    if (onUpdate) {
      const localMemo = memoGen();
      setMemo(localMemo);
      onUpdate(localMemo);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount and unmount
  useEffect(() => {
    debug && debug("Mounting");
    if (memo !== null && onMount) {
      onMount(memo);
    }
    isInitedRef.current = true;
    return () => {
      debug && debug("Unmounting");
      unsubscribe();
      if (memo !== null && onDestroy) {
        onDestroy(memo);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return memo;
};
