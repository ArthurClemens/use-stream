import React, { FunctionComponent } from "react";
import { useStream } from "use-stream";
import flyd from "flyd";
import Debug from "debug";
import "./styles.css";

const debug = Debug("test-use-stream:counter");
debug.enabled = true;
debug.log = console.log.bind(console);

const debugLib = Debug("test-use-stream:lib");
debugLib.enabled = true;
debugLib.log = console.log.bind(console);

type TCounter = {
  id: string;
  count: number;
};

type TModel = {
  count: flyd.Stream<number>;
}

const Counter: FunctionComponent<TCounter> = props => {
  debug("Render Counter");
  const { count } = useStream<TModel>((
    debug("Init model"),
    {
      model: {
        count: flyd.stream(props.count)
      },
      debug: debugLib
    }
  ));
  return (
    <div className="ui segment form demo-section">
      <h2 className="ui header">Counter {props.id}</h2>
      <h3 className="ui header">{count()}</h3>
      <p>
        <button
          className="ui button primary"
          onClick={() => count(count() - 1)}
          disabled={count() === 0}
        >
          Decrement
        </button>
        <button
          className="ui button primary"
          onClick={() => count(count() + 1)}
          disabled={count() === 100}
        >
          Increment
        </button>
      </p>
    </div>
  );
};

export const CounterPage = () => (
  <>
    <div className="ui medium header demo-title">
      useStream with Flyd example: Simple counter
    </div>
    <Counter id="1" count={0} />
    <Counter id="2" count={100} />
  </>
);
