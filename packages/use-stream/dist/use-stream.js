!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).useStream={},e.React)}(this,(function(e,t){"use strict";function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var u=n(t);e.useStream=({model:e,onMount:t,onDestroy:n,onUpdate:r,deps:f=[],defer:o,debug:s})=>{const[a,c]=u.default.useState({}),i=u.default.useRef(!1),d=u.default.useRef([]),l=()=>{d.current.length&&(s&&s("Unsubscribe"),d.current.forEach(e=>e.end(!0)),d.current=[])},p=()=>{s&&s("createMemo"),l();const t=("function"==typeof e?e:()=>e)();return(e=>{s&&s("Subscribe"),d.current=Object.keys(e).map(t=>{const n=e[t];return!(!n.map||"function"!=typeof n.map)&&n.map(e=>(s&&s("Will update %s",t),c(Object.assign(Object.assign({},a),{[t]:e})),null))}).filter(Boolean)})(t),t},[b,g]=u.default.useState(o?Object.assign(Object.assign({},e),{isDeferred:!0}):p);return u.default.useEffect(()=>{if(i.current&&(s&&s("Updating"),r)){const e=p();g(e),r(e)}},f),u.default.useEffect(()=>{s&&s("Mounting");let e=b;return o&&(e=p(),g(e)),t&&e&&t(e),i.current=!0,()=>{s&&s("Unmounting"),l(),n&&n(b)}},[]),b},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=use-stream.js.map
