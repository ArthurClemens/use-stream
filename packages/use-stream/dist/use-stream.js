!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e=e||self).useStream={},e.React)}(this,(function(e,t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n=function(){return(n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var u in t=arguments[n])Object.prototype.hasOwnProperty.call(t,u)&&(e[u]=t[u]);return e}).apply(this,arguments)};e.useStream=function(e){var r=e.model,u=e.onMount,o=e.onDestroy,f=e.onUpdate,c=e.deps,i=void 0===c?[]:c,a=e.defer,s=e.debug,p=t.useState({}),l=p[0],d=p[1],y=t.useRef(!1),b=t.useRef([]),m=function(){b.current.length&&(s&&s("Unsubscribe"),b.current.forEach((function(e){return e.end(!0)})),b.current=[])},v=function(){s&&s("createMemo"),m();var e=("function"==typeof r?r:function(){return r})();return function(e){s&&s("Subscribe"),b.current=Object.keys(e).map((function(t){var r=e[t];return!(!r.map||"function"!=typeof r.map)&&r.map((function(e){var r;return s&&s("Will update %s",t),d(n(n({},l),((r={})[t]=e,r))),null}))})).filter(Boolean)}(e),e},g=t.useState(a?null:v),h=g[0],O=g[1];return t.useEffect((function(){if(y.current&&(s&&s("Updating"),f)){var e=v();O(e),f(e)}}),i),t.useEffect((function(){s&&s("Mounting");var e=h;return a&&(e=v(),O(e)),u&&e&&u(e),y.current=!0,function(){s&&s("Unmounting"),m(),null!==h&&o&&o(h)}}),[]),h},Object.defineProperty(e,"__esModule",{value:!0})}));
