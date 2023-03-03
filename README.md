# use-stream

A React Hook for working with streams inside function components.

- [Motivation](#motivation)
- [Example](#example)
- [Live examples](#live-examples)
- [Usage](#usage)
  - [Stream libraries](#stream-libraries)
  - [Mithril Stream](#mithril-stream)
  - [Flyd](#flyd)
- [API](#api)
  - [`model`](#model)
    - [Optimizing the model instantiation](#optimizing-the-model-instantiation)
      - [Model function](#model-function)
      - [Deferring instantiation](#deferring-instantiation)
    - [Using TypeScript](#using-typescript)
  - [`defer`](#defer)
  - [`deps`](#deps)
  - [`onMount`](#onmount)
  - [`onUpdate`](#onupdate)
  - [`onDestroy`](#ondestroy)
  - [`debug`](#debug)
- [Sizes](#sizes)



## Motivation

[Hooks and Streams](https://james-forbes.com/#!/posts/hooks-and-streams) by James Forbes is a great introduction to streams. The article makes the case why streams are a better approach than hooks: "Streams are a composeable, customizable, time-independent data structure that does everything hooks do and more". Streams are a great way to handle state and to create reactive apps.

The downside: streams do not fit neatly within React's component rendering.

* Function components are ran each render, so any state is either lost or re-initialized, except when using Redux or Hooks.
* Stream state is disconnected from component state, so when a stream gets updated no new state is rendered.

This is where `useStream` comes in:

* Memoizes streams so that they are initialized only once.
* Re-renders the component whenever a stream is updated.


## Example

```jsx
import React from "react";
import { useStream } from "use-stream";
import stream from "mithril/stream"; // or another stream library

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
        <button
          onClick={() => count(count() - 1)}
          disabled={count() === 0}
        >
          Decrement
        </button>
        <button onClick={() => count(count() + 1)}>Increment</button>
      </p>
    </div>
  );
}
```


## Live examples

* [All examples](https://codesandbox.io/dashboard/all/useStream?workspace=214fe89f-3718-4af2-9611-3b2cb150dcc5)
* Listed examples:
  * [Simple counter](https://codesandbox.io/s/usestream-simple-counter-futo1)
  * [Simple counter with Flyd (TypeScript)](https://codesandbox.io/s/usestream-with-flyd-example-simple-counter-85hw6)
  * [James Forbes' useInterval](https://codesandbox.io/s/usestream-with-useinterval-hi9od)
  * [Meisois pattern for a counter](https://codesandbox.io/s/usestream-meiosis-pattern-fsu7e)
  * [Flyd example: simple sum](https://codesandbox.io/s/usestream-flyd-example-sum-0hw32)
  * [Ramda example: filtered input](https://codesandbox.io/s/usestream-ramda-filter-w05t2)


## Usage

`npm install use-stream`

### Stream libraries

You can use any stream library. The only prerequisite is that the stream has a `map` method.

### Mithril Stream

In some examples below we'll use the lightweight stream module from Mithril, which comes separate from Mithril core code.

[Mithril Stream documentation](https://mithril.js.org/stream.html)


### Flyd

More full fledged stream library, but still quite small.

[Flyd documentation](https://github.com/paldepind/flyd)


## API

```js
useStream({ model })
useStream({ model, deps, onMount, onUpdate, onDestroy, debug })
```

Type definition:

```ts
useStream<TModel>({ model, deps, onMount, onUpdate, onDestroy, debug } : {
  model: TModelGen<TModel>,
  defer?: boolean;
  deps?: React.DependencyList;
  onMount?: (model: TModel) => any,
  onUpdate?: (model: TModel) => any,
  onDestroy?: (model: TModel) => any,
  debug?: Debug.Debugger
}): TModel

interface Model {
  [key: string]: TStream<unknown>;
}

type TModelFn<TModel extends Model> = (_?: unknown) => TModel;

type TModelGen<TModel extends Model> = TModel | TModelFn<TModel>;
```


### `model`

The model is a POJO object with (optionally multiple) streams.
`useStream` returns this model once it is initialized.

Note that the model streams will be called at each render. See [Optimizing the model instantiation](#optimizing-the-model-instantiation) below.
 
Example:
 
```js
const { index, count } = useStream({
  model: {
    index: stream(0),
    count: stream(3)
  }
})
```

#### Optimizing the model instantiation

##### Model function

With a POJO object the model streams will be called at each render. While this does't mean that streams are reset at each call (because their results are memoized), some overhead may occur, and you need to be careful if you are causing side effects.

The optimization is to pass a function that returns the model object. This approach also gives more flexibility, for instance to connect model streams before passing the model.
 
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

##### Deferring instantiation

One further optimization is to defer the initialization to the first render. See [defer](#defer) below for elaboration.


#### Using TypeScript

```ts
import flyd from "flyd";

type TModel = {
  count: flyd.Stream<number>;
}

const { count } = useStream<TModel>({
  model: {
    count: flyd.stream(0)
  }
});

// When using a model function:

const { count } = useStream<TModel>({
  model: () => ({
    count: flyd.stream(0)
  })
});

// count is now:
// const count: flyd.Stream<number>
```


Type definition:

```ts
model: TModelGen<TModel>

type TModelGen<TModel> = TModel | TModelFn<TModel>
type TModelFn<TModel> = (_?: any) => TModel
```


### `defer`

Postpones the model initialization until after the first render (in `React.useEffect`). This also prevents that the initialization is called more than once. 

The result of postponing to after the first render is that the model will not be available immediately.

The return contains the model plus boolean `isDeferred`, which can be used for conditional rendering.

Example:

```js
const model = useStream({
  model: () => ({ // first optimization: model function
    index: stream(0),
    count: stream(3)
  }),
  defer: true, // second optimization
})

const { index, count, isDeferred } = model

if (isDeferred) {
  // first render
  return null
}

```


Type definition:

```ts
defer?: boolean
```


### `deps`

React hooks deps array. Default `[]`.

```js
deps: [props.initCount]
```

Type definition:

```ts
deps?: React.DependencyList
```


### `onMount`

Callback method to run side effects when the containing component is mounted.

```js
onMount: (model) => {
  // Handle any side effects.
}
```

Type definition:

```ts
onMount?: (model: TModel) => any
```


### `onUpdate`

When using `deps`. Callback method to run side effects when the containing component is updated through `deps`.

```js
deps: [props.initCount],
onUpdate: (model) => {
  // Called when `initCount` is changed. Handle any side effects.
}
```

Type definition:

```ts
onUpdate?: (model: TModel) => any
```


### `onDestroy`

Callback method to clean up side effects. `onDestroy` is called when the containing component goes out of scope.

```js
onDestroy: (model) => {
  // Cleanup of any side effects.
}
```

Type definition:

```ts
onDestroy?: (model: TModel) => any
```


### `debug`

Debugger instance. See: https://www.npmjs.com/package/debug

Provides feedback on the lifecycle of the model instance and stream subscriptions.

Example:

```js
import Debug from "debug";

const debugUseStream = Debug("use-stream");
debugUseStream.enabled = true;
debugUseStream.log = console.log.bind(console);

const model = useStream({
  model: ...,
  debug: debugUseStream,
});

```

Type definition:

```ts
debug?: Debug.Debugger
```

## Sizes

```
┌────────────────────────────────────────┐
│                                        │
│   Bundle Name:  use-stream.module.js   │
│   Bundle Size:  2.1 KB                 │
│   Minified Size:  852 B                │
│   Gzipped Size:  486 B                 │
│                                        │
└────────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│   Bundle Name:  use-stream.umd.js   │
│   Bundle Size:  2.72 KB             │
│   Minified Size:  1.09 KB           │
│   Gzipped Size:  615 B              │
│                                     │
└─────────────────────────────────────┘

┌──────────────────────────────────┐
│                                  │
│   Bundle Name:  use-stream.cjs   │
│   Bundle Size:  2.19 KB          │
│   Minified Size:  940 B          │
│   Gzipped Size:  537 B           │
│                                  │
└──────────────────────────────────┘
```