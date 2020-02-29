import { useEffect, useState } from "react";
import { UseStream } from "../index";

export const useStream: UseStream.useStream = ({ initLazily, model, onMount, onDestroy }) => {
  // Memoized model
  const [memo, setMemo] = useState(!initLazily
    ? typeof model === "function" ? model() : model
    : null
  );

  // Local storage that connects stream updates to React renders
  const [streamValues, setStreamValues] = useState<{ [key:string]: any }>({});

  useEffect(() => {
    // Because this function only runs once, we need to have the value of memo.
    // So we cannot wait for the result of setState(memo).
    const localMemo: UseStream.Model = !initLazily
      ? memo // already stored
      : typeof model === "function" ? model() : model;
    
    if (initLazily) {
      setMemo(localMemo);
    }

    // Subscribe to stream changes: updates are written to streamValues
    Object.keys(localMemo).forEach((key: string) => {
      const stream = localMemo[key];
      // Don't map over items that are not streams
      if (!stream.map || typeof stream !== "function") {
        return;
      }
      stream.map((value: any) => setStreamValues({
        ...streamValues,
        [key]: value
      }));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const memoValue = memo;
    if (onMount) {
      onMount(memoValue);
    }
    if (onDestroy) {
      return () => {
        onDestroy(memoValue);
      };
    }
  }, [onMount, onDestroy]); // eslint-disable-line react-hooks/exhaustive-deps

  return memo;
};
