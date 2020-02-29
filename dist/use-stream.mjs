import { useState, useEffect } from 'react';

const useStream = ({ defer, model, onMount, onDestroy }) => {
    // Memoized model
    const [memo, setMemo] = useState(!defer
        ? typeof model === "function" ? model() : model
        : null);
    // Local storage that connects stream updates to React renders
    const [streamValues, setStreamValues] = useState({});
    useEffect(() => {
        // Because this function only runs once, we need to have the value of memo.
        // So we cannot wait for the result of setState(memo).
        const localMemo = !defer
            ? memo // already stored
            : typeof model === "function" ? model() : model;
        if (defer) {
            setMemo(localMemo);
        }
        // Subscribe to stream changes: updates are written to streamValues
        Object.keys(localMemo).forEach((key) => {
            const stream = localMemo[key];
            // Don't map over items that are not streams
            if (!stream.map || typeof stream !== "function") {
                return;
            }
            stream.map((value) => setStreamValues({
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
        return () => {
            if (onDestroy) {
                onDestroy(memoValue);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return memo;
};

export { useStream };
