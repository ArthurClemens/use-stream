import { useRef, useEffect, useState } from 'react';

const useStream = ({ model, onMount, onDestroy }) => {
    const memo = useRef(model);
    Object.keys(model).forEach(k => update(model[k]));
    useEffect(() => {
        if (onMount) {
            onMount(memo.current);
        }
        if (onDestroy) {
            return () => onDestroy(memo.current);
        }
    }, []);
    return memo.current;
};
/**
* Provides an update to React whenever a stream gets updated.
*/
const update = (stream) => {
    const [, setValue] = useState();
    useEffect(() => {
        stream.map(setValue);
    }, []);
};

export { useStream };
