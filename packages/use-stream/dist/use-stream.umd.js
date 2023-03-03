(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react")) : typeof define === "function" && define.amd ? define(["exports", "react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.useStream = {}, global.React));
})(this, function(exports2, React) {
  "use strict";
  const useStream = ({
    model,
    onMount,
    onDestroy,
    onUpdate,
    deps = [],
    defer,
    debug
  }) => {
    const [streamValues, setStreamValues] = React.useState({});
    const isInitedRef = React.useRef(false);
    const subsRef = React.useRef([]);
    const subscribe = (memo2) => {
      if (debug) {
        debug("Subscribe");
      }
      subsRef.current = Object.keys(memo2).map((key) => {
        const stream = memo2[key];
        if (stream.map && typeof stream.map === "function") {
          return stream.map((value) => {
            if (debug) {
              debug("Will update %s", key);
            }
            setStreamValues({
              ...streamValues,
              [key]: value
            });
            return null;
          });
        }
        return false;
      }).filter(Boolean);
    };
    const unsubscribe = () => {
      if (subsRef.current.length) {
        if (debug) {
          debug("Unsubscribe");
        }
        subsRef.current.forEach((s) => s.end(true));
        subsRef.current = [];
      }
    };
    const createMemo = () => {
      if (debug) {
        debug("createMemo");
      }
      unsubscribe();
      const modelFn = typeof model === "function" ? model : () => model;
      const memo2 = modelFn();
      subscribe(memo2);
      return memo2;
    };
    const [memo, setMemo] = React.useState(
      defer ? { ...model, isDeferred: true } : createMemo
    );
    React.useEffect(() => {
      if (!isInitedRef.current) {
        return;
      }
      if (debug) {
        debug("Updating");
      }
      if (onUpdate) {
        const localMemo = createMemo();
        setMemo(localMemo);
        onUpdate(localMemo);
      }
    }, deps);
    React.useEffect(() => {
      if (debug) {
        debug("Mounting");
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
          debug("Unmounting");
        }
        unsubscribe();
        if (onDestroy) {
          onDestroy(memo);
        }
      };
    }, []);
    return memo;
  };
  exports2.useStream = useStream;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=use-stream.umd.js.map
