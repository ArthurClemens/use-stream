import { useEffect, useState } from "react";
import * as UseStream from "../index";

export const useStream = <TGenModel>({ defer, model, onMount, onDestroy } : UseStream.UseStreamProps<TGenModel>) => {
  // Memoized model
  const [memo, setMemo] = useState<TGenModel | null>(!defer
    ? typeof model === "function" ? model() : model
    : null // deferred
  );

  // Local storage that connects stream updates to React renders
  const [streamValues, setStreamValues] = useState<{ [key:string]: any }>({});

  useEffect(() => {
    // Because this function only runs once, we need to have the value of memo.
    // So we cannot wait for the result of setState(memo).
    const localMemo: (TGenModel | null) = !defer
      ? memo // already stored
      : typeof model === "function" ? model() : model;
    
    if (defer) {
      setMemo(localMemo);
    }

    // Subscribe to stream changes: updates are written to streamValues
    if (localMemo) {
      type Model = {
        [key:string]: any
      }
      Object.keys(localMemo).forEach((key: string) => {
        type Stream = {
          map: (_:any) => any;
        } & any
        const stream: Stream = (localMemo as Model)[key];
        if (stream.map && typeof stream.map === "function") {
          stream.map((value: any) => setStreamValues({
            ...streamValues,
            [key]: value
          }));
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // mount and unmount
  useEffect(() => {
    if (memo !== null && onMount) {
      onMount(memo);
    }
    return () => {
      if (memo !== null && onDestroy) {
        onDestroy(memo);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return memo;
};
