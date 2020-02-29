# useStream

A React Hook for working with streams inside function components.

- [Motivation](#motivation)
- [Example](#example)
- [Live examples](#live-examples)
- [Usage](#usage)
- [API](#api)
  - [Parameters](#parameters)
    - [`model`](#model)
    - [`onMount`](#onmount)
    - [`onDestroy`](#ondestroy)
    - [`defer`](#defer)
- [Size](#size)



## Motivation

[Hooks and Streams](https://james-forbes.com/#!/posts/hooks-and-streams) by James Forbes is a great introduction to streams. The article makes the case why streams are a better approach than hooks: "Streams are a composeable, customizable, time-independent data structure that does everything hooks do and more". Streams are a great way to handle state and to create reactive apps.

The downside: streams do not fit neatly within React's component rendering.

* Function components are ran each render, so any state is either lost or re-initialized, except when using Redux or Hooks.
* When a stream gets updated, the component does not get the message, so no new state is rendered.

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

Code examples on CodeSandbox:

* [Simple counter](https://codesandbox.io/s/usestream-simple-counter-futo1)
  * [The same simple counter with Flyd](https://codesandbox.io/s/usestream-simple-counter-with-flyd-85hw6)
* [James Forbes' useInterval](https://codesandbox.io/s/usestream-with-useinterval-hi9od)
* [Meisois pattern for a counter](https://codesandbox.io/s/usestream-meiosis-pattern-fsu7e)
* [Flyd example: simple sum](https://codesandbox.io/s/usestream-flyd-example-sum-0hw32)
* [Ramda example: filtered input](https://codesandbox.io/s/usestream-ramda-filter-w05t2)


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
useStream({ model, onMount?, onDestroy?, defer? }) => model
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
 
For more flexibility, pass a function that returns the model object. See also `defer` 
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

Callback method to clean up side effects. `onDestroy` is called when the containing component goes out of scope.

```js
onDestroy: (model) => {
  // cleanup
}
```

Type definition:

```ts
onDestroy?: (model: Model) => any;
```

#### `defer`

Optimization to prevent that stream initialization functions are ran at each render.
The default behavior does not mean that streams are reset (as their results are memoized),
but this optimization may prevent problems when model streams involve calling side effects.

Technically, `defer` will postpone the initialization functions until after the first
render (in `React.useEffect`). That means that in the first render the model will not be
available yet.

Example:

```js
const model = useStream({
  defer: true,
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
  defer: true,
  model: createModel({ defaultIndex: 1 })
})

if (!model) {
  return null
}

const { index } = model
```

Type definition:

```ts
defer?: boolean;
```


## Size

430 bytes gzipped
