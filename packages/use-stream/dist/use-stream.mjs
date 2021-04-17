import React from 'react';

// eslint-disable-next-line import/no-unresolved
const useStream = ({ model, onMount, onDestroy, onUpdate, deps = [], defer, debug, }) => {
    // Local storage that connects stream updates to React renders:
    const [streamValues, setStreamValues] = React.useState({});
    // Distinguish update from mount:
    const isInitedRef = React.useRef(false);
    const subsRef = React.useRef([]);
    const subscribe = (memo) => {
        if (debug) {
            debug('Subscribe');
        }
        subsRef.current = Object.keys(memo)
            .map((key) => {
            const stream = memo[key];
            if (stream.map && typeof stream.map === 'function') {
                return stream.map((value) => {
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
            .filter(Boolean);
    };
    const unsubscribe = () => {
        if (subsRef.current.length) {
            if (debug) {
                debug('Unsubscribe');
            }
            subsRef.current.forEach((s) => s.end(true));
            subsRef.current = [];
        }
    };
    const createMemo = () => {
        if (debug) {
            debug('createMemo');
        }
        unsubscribe();
        const modelFn = typeof model === 'function'
            ? model
            : (() => model);
        const memo = modelFn();
        subscribe(memo);
        return memo;
    };
    const [memo, setMemo] = React.useState(defer
        ? { ...model, isDeferred: true }
        : createMemo);
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

export { useStream };
