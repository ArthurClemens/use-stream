import React, { FunctionComponent } from "react";
import { useStream } from "use-stream";
import flyd from "flyd";

import "./styles.css";

type TCounter = {
  id: string;
  count: number;
};

type TModel = {
  count: flyd.Stream<number>;
}

export const Counter: FunctionComponent<TCounter> = props => {
  const { count } = useStream<TModel>({
    model: {
      count: flyd.stream(props.count)
    }
  });
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
