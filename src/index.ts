import { useEffect, useRef, useState } from "react";
import Stream from "mithril/stream";
import { UseStream } from "../index";

export const useStream: UseStream = ({ model, onMount, onDestroy }) => {
  const memo = useRef(model)
  Object.keys(model).forEach(k => update(model[k]))
 
  useEffect(
    () => {
      if (onMount) {
        onMount(memo.current);
      }
      if (onDestroy) {
        return () => onDestroy(memo.current);
      }
    }, []
  );
  return memo.current;
};

/**
* Provides an update to React whenever a stream gets updated.
*/
const update = <T>(stream: Stream<T>) => {
  const [, setValue] = useState<T>();

  useEffect(() => {
    stream.map(setValue);
  }, []);
};
