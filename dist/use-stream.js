!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e=e||self).useStream={},e.react)}(this,(function(e,t){"use strict";e.useStream=({defer:e,model:o,onMount:n,onDestroy:f})=>{const[u,c]=t.useState(e?null:"function"==typeof o?o():o),[r,s]=t.useState({});return t.useEffect(()=>{const t=e?"function"==typeof o?o():o:u;e&&c(t),Object.keys(t).forEach(e=>{const o=t[e];o.map&&"function"==typeof o&&o.map(t=>s({...r,[e]:t}))})},[]),t.useEffect(()=>{const e=u;if(n&&n(e),f)return()=>{f(e)}},[n,f]),u},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=use-stream.js.map
