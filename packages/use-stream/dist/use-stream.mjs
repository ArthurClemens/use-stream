import React from 'react';

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var useStream = function (_a) {
    var model = _a.model, onMount = _a.onMount, onDestroy = _a.onDestroy, onUpdate = _a.onUpdate, _b = _a.deps, deps = _b === void 0 ? [] : _b, defer = _a.defer, debug = _a.debug;
    // Local storage that connects stream updates to React renders:
    var _c = React.useState({}), streamValues = _c[0], setStreamValues = _c[1];
    // Distinguish update from mount:
    var isInitedRef = React.useRef(false);
    var subsRef = React.useRef([]);
    var subscribe = function (memo) {
        if (debug) {
            debug('Subscribe');
        }
        subsRef.current = Object.keys(memo)
            .map(function (key) {
            var stream = memo[key];
            if (stream.map && typeof stream.map === 'function') {
                return stream.map(function (value) {
                    var _a;
                    if (debug) {
                        debug('Will update %s', key);
                    }
                    setStreamValues(__assign(__assign({}, streamValues), (_a = {}, _a[key] = value, _a)));
                    return null;
                });
            }
            return false;
        })
            .filter(Boolean);
    };
    var unsubscribe = function () {
        if (subsRef.current.length) {
            if (debug) {
                debug('Unsubscribe');
            }
            subsRef.current.forEach(function (s) { return s.end(true); });
            subsRef.current = [];
        }
    };
    var createMemo = function () {
        if (debug) {
            debug('createMemo');
        }
        unsubscribe();
        var modelFn = typeof model === 'function'
            ? model
            : (function () { return model; });
        var memo = modelFn();
        subscribe(memo);
        return memo;
    };
    var _d = React.useState(defer ? null : createMemo), memo = _d[0], setMemo = _d[1];
    // Update
    React.useEffect(function () {
        if (!isInitedRef.current) {
            return;
        }
        if (debug) {
            debug('Updating');
        }
        if (onUpdate) {
            var localMemo = createMemo();
            setMemo(localMemo);
            onUpdate(localMemo);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
    // Mount and unmount
    React.useEffect(function () {
        if (debug) {
            debug('Mounting');
        }
        var localMemo = memo;
        if (defer) {
            localMemo = createMemo();
            setMemo(localMemo);
        }
        if (onMount && localMemo) {
            onMount(localMemo);
        }
        isInitedRef.current = true;
        return function () {
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
