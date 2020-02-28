# useStream

A React hook to work with streams.

Motivation: [Hooks and Streams](https://james-forbes.com/#!/posts/hooks-and-streams) by James Forbes. While the example code in this article uses [Mithril](https://mithril.js.org), `useStream` allows you to use streams in React applications.

## Features

* Enables React rendering whenever streams are updated
* `onMount` callback function for creating side effects
* `onDestroy` callback function for cleaning up (for example stopping streams)

Streams are memoized so that they are initialized only once.


## Usage

`npm install use-stream`

You can use any stream library. In the examples below we'll use the lightweight stream module from Mithril, which comes separate from Mithril core code.

### With Mithril

`npm install mithril`

```js
import stream from "mithril/stream";
```

### With Flyd

```js
import { stream } from "flyd";
```

## API

`useStream({ model, onMount?, onDestroy? }) => model`

`model` is a POJO object with streams as values: 

```js
const count = useStream({
  model: {
    count: stream(0),
  }
})
```

`onMount` is an optional callback function to be called at mount:

```
onMount: (model) => {
  // any side effects
}
```

`onDestroy` is an optional callback function to be called when the stream gets out of scope:

```
onDestroy: (model) => {
  // cleanup, for example:
  // model.count.end(true)
}
```

## Examples 

### Simple counter

* [React with Mithril streams on CodeSandbox](https://codesandbox.io/s/usestream-simple-counter-futo1)
* [React with Flyd streams on CodeSandbox](https://codesandbox.io/s/usestream-simple-counter-with-flyd-85hw6)

```js
import React from "react";
import { useStream } from "use-stream";
import stream from "mithril/stream";

const App = () => {
  const { count } = useStream({
    model: {
      count: stream(0)
    }
  });
  return (
    <div className="page">
      <h1>{count()}</h1>
      <p>
        <button onClick={() => count(count() - 1)} disabled={count() === 0}>
          Decrement
        </button>
        <button onClick={() => count(count() + 1)}>Increment</button>
      </p>
    </div>
  );
}

```

### Example with James Forbes' useInterval

[React with Mithril streams on CodeSandbox](https://codesandbox.io/s/usestream-with-useinterval-hi9od)

```js
import React from "react";
import { useStream } from "use-stream";
import stream from "mithril/stream";

import "./styles.css";

// Code comments at https://james-forbes.com/#!/posts/hooks-and-streams
const interval = ({ delay }) => {
  const id = stream();
  const tick = stream();

  delay.map(delay => {
    clearInterval(id());
    id(setInterval(tick, delay, delay));
    return null;
  });

  delay.end.map(() => {
    clearInterval(id());
    return null;
  });

  return tick;
};

const UNIT = 100;
const INIT_DELAY = 500;

const App = () => {
  const model = useStream({
    model: {
      delay: stream(INIT_DELAY),
      count: stream(0)
    },
    onMount: ({ count, delay }) => {
      const tick = interval({ delay });
      tick.map(() => count(count() + 1));
    },
    onDestroy: ({ count, delay }) => {
      // Clean up
      delay.end(true);
    }
  });
  const { count, delay } = model;

  return (
    <div className="page">
      <h1>{count()}</h1>
      <p>Delay: {delay()} ms</p>
      <p>
        <button
          onClick={() => delay(delay() - UNIT)}
          disabled={delay() === UNIT}
        >
          Decrement
        </button>
        <button onClick={() => delay(delay() + UNIT)}>Increment</button>
      </p>
    </div>
  );
}
```

## Size

387 bytes gzipped
