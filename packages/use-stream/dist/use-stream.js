import { useState, useRef, useEffect } from 'react';

const useStream = ({ model, onMount, onDestroy, onUpdate, deps = [], defer, debug, }) => {
    // Local storage that connects stream updates to React renders:
    const [streamValues, setStreamValues] = useState({});
    // Distinguish update from mount:
    const isInitedRef = useRef(false);
    // Keep reference of all streams that update streamValues so they can be stopped:
    const subsRef = useRef([]);
    const subscribe = (memo) => {
        debug && debug("Subscribe");
        subsRef.current = Object.keys(memo)
            .map((key) => {
            const stream = memo[key];
            return stream.map && typeof stream.map === "function"
                ? stream.map((value) => {
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
        if (subsRef.current.length) {
            debug && debug("Unsubscribe");
            subsRef.current.forEach((s) => s.end(true));
            subsRef.current = [];
        }
    };
    const createMemo = () => {
        debug && debug("createMemo");
        unsubscribe();
        const modelFn = typeof model === "function"
            ? model
            : (() => model);
        const memo = modelFn();
        subscribe(memo);
        return memo;
    };
    const [memo, setMemo] = useState(defer ? null : createMemo);
    // Update
    useEffect(() => {
        if (!isInitedRef.current) {
            return;
        }
        debug && debug("Updating");
        if (onUpdate) {
            const localMemo = createMemo();
            setMemo(localMemo);
            onUpdate(localMemo);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
    // Mount and unmount
    useEffect(() => {
        debug && debug("Mounting");
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
            debug && debug("Unmounting");
            unsubscribe();
            if (memo !== null && onDestroy) {
                onDestroy(memo);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return memo;
};

export { useStream };
