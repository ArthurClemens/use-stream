# useStream

A React Hook for working with streams.

- [Motivation](#motivation)
- [Usage](#usage)
- [API](#api)
  - [Parameters](#parameters)
    - [`model`](#model)
    - [`onMount`](#onmount)
    - [`onDestroy`](#ondestroy)
    - [`initLazily`](#initlazily)
- [Examples](#examples)
  - [Simple counter](#simple-counter)
  - [Example with James Forbes' useInterval](#example-with-james-forbes-useinterval)
- [Size](#size)


## Motivation

[Hooks and Streams](https://james-forbes.com/#!/posts/hooks-and-streams) by James Forbes is a great introduction to streams. The article makes the case why streams are a better approach than hooks: "Streams are a composeable, customizable, time-independent data structure that does everything hooks do and more". Streams are a great way to handle state and to create reactive apps.

The downside: streams do not fit neatly within React's component rendering.

* Function components are ran each render, so any state is either lost or re-initialized, except when using Redux or Hooks.
* When a stream gets updated, the component does not get the message, so no new state is rendered.

This is where `useStream` comes in:

* Memoizes streams so that they are initialized only once.
* Re-renders the component whenever a stream is updated.



## Usage

`npm install use-stream`

You can use any stream library. In the examples below we'll use the lightweight stream module from Mithril, which comes separate from Mithril core code.

`npm install mithril`

```js
import stream from "mithril/stream";
```

or use another stream library like [Flyd](https://github.com/paldepind/flyd):

`npm install flyd`

```js
import { stream } from "flyd";
```

## API

```ts
useStream({ model, onMount?, onDestroy?, initLazily? }) => model
```

### Parameters

#### `model`

The model is a POJO object with (optionally multiple) streams.
`useStream` returns this model once it is initialized.
 
Example:
 
```js
const model = useStream({
  model: {
    index: stream(0),
    count: stream(3)
  }
})
 
const { index, count } = model
const countValue = count()
```

Or shorter:

```js
const { index, count } = useStream({
  model: {
    index: stream(0),
    count: stream(3)
  }
})
```
 
For more flexibility, pass a function that returns the model object. See also `initLazily` 
how to combine this for optimization.
 
Example:
 
```js 
const { index, count } = useStream({
  model: () => {
    const index = stream(0)
    const count = stream(3)
    count.map(console.log) // another stream that is subscribed to the count stream
    return {
      index,
      count
    }
  }
})
```

Type definition:

```ts
model: Model | ModelFn;

type Model = {
  [key:string]: Stream<any>;
}

type ModelFn = (_?:any) => Model
```

#### `onMount`

Callback method to run side effects when the containing component is mounted.

```js
onMount: (model) => {
  // any side effects
}
```

Type definition:

```ts
onMount?: (model: Model) => any;
```

#### `onDestroy`


```js
onDestroy: (model) => {
  // cleanup, for example:
  // model.count.end(true)
}
```

Type definition:

```ts
onDestroy?: (model: Model) => any;
```

#### `initLazily`

Optimization to prevent that stream initialization functions are ran at each render.
The default behavior does not mean that streams are reset (as their results are memoized),
but this optimization may prevent problems when model streams involve calling side effects.

Technically, `initLazily` will postpone the initialization functions until after the first
render (in `React.useEffect`). That means that in the first render the model will not be
available yet.

Example:

```js
const model = useStream({
  initLazily: true,
  model: {
    index: stream(0),
    count: stream(3)
  }
})

if (!model) {
  // first render
  return null
}

const { index, count } = model
```

When the model is created by a factory function, you should combine this optimization with
the "pass a function that returns the model" approach (see: model).

Example:

```js
const createModel = ({ defaultIndex = 0 }) => {
  const index = stream(defaultIndex)
  // Possibly creates other streams and methods on streams...

  return {
    index
  }
}

const model = useStream({
  initLazily: true,
  model: createModel({ defaultIndex: 1 })
})

if (!model) {
  return null
}

const { index } = model
```

Type definition:

```ts
initLazily?: boolean;
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
        <button onClick={() => count(count() - 1)} disabled={count() === 0}>Decrement</button>
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

430 bytes gzipped
