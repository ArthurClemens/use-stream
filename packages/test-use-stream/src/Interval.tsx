import React, { useState, FunctionComponent } from "react";
import { useStream } from "use-stream";
import flyd from "flyd";
import Debug from "debug";

const debug = Debug("test-use-stream:interval");
debug.enabled = true;
debug.log = console.log.bind(console);

const debugInterval = Debug("test-use-stream:interval-fn");
debugInterval.enabled = true;
debugInterval.log = console.log.bind(console);

const debugLib = Debug("test-use-stream:lib");
debugLib.enabled = true;
debugLib.log = console.log.bind(console);

// Code comments at https://james-forbes.com/#!/posts/hooks-and-streams
const interval = ({ delay }: { delay: flyd.Stream<number> }) => {
  const id: flyd.Stream<number> = flyd.stream();
  const tick: flyd.Stream<number> = flyd.stream();

  delay.map(delay => {
    debugInterval("New delay");
    debugInterval("Clear interval '%s'", id());
    clearInterval(id());
    id(window.setInterval(tick, delay, delay));
    debugInterval("Set new interval '%s'", id());
    return null;
  });

  delay.end.map(() => {
    debugInterval("Delay end");
    debugInterval("Clear interval '%s'", id());
    clearInterval(id());
    return null;
  });

  return tick;
};

const UNIT = 100;

type TModel = {
  delay: flyd.Stream<number>;
  count: flyd.Stream<number>;
};

type TCounter = {
  initCount: number;
  initDelay: number;
};

const Counter: FunctionComponent<TCounter> = props => {
  debug("Render Counter");
  const { count, delay } = useStream<TModel>({
    model: () => {
      debug("Init model");
      const delay = flyd.stream(props.initDelay);
      const count = flyd.stream(props.initCount);

      return {
        delay,
        count
      };
    },
    deps: [props.initCount],
    onMount: ({ count, delay }) => {
      debug("onMount");
      const tick = interval({ delay });
      tick.map(() => count(count() + 1));
    },
    onUpdate: ({ count, delay }) => {
      debug("onUpdate");
      delay.end(); // Clean up side effects
      const tick = interval({ delay });
      tick.map(() => count(count() + 1));
    },
    onDestroy: ({ delay, count }) => {
      debug("onDestroy");
      delay.end(true); // Clean up side effects
    },
    debug: debugLib,
  });

  return (
    <div className="ui segment form demo-section">
      <h2 className="ui header">{count()}</h2>
      <h3 className="ui header">Delay: {delay()} ms</h3>
      <p>
        <button
          className="ui button primary"
          onClick={() => delay(delay() + UNIT)}
        >
          Slower
        </button>
        <button
          className="ui button primary"
          onClick={() => delay(delay() - UNIT)}
          disabled={delay() === UNIT}
        >
          Faster
        </button>
      </p>
    </div>
  );
};

const INIT_VALUES = [0, 500];

export const IntervalPage = () => {
  const [showCounter, setShowCounter] = useState(true);
  const [initValues, setInitValues] = useState(INIT_VALUES);

  return (
    <>
      <div className="ui medium header demo-title">
        useStream with side effects example: interval
      </div>
      <button
        className="ui button small"
        onClick={() => {
          const showValue = !showCounter;
          setShowCounter(showValue);
          if (showValue) {
            setInitValues(INIT_VALUES);
          }
        }}
      >
        Toggle Counter
      </button>

      {showCounter ? (
        <>
          <button
            className="ui button small"
            onClick={() =>
              setInitValues([
                Math.round(Math.random() * 100),
                100 + 100 * Math.round(Math.random() * 10)
              ])
            }
          >
            Re-init counter
          </button>
          <Counter initCount={initValues[0]} initDelay={initValues[1]} />
        </>
      ) : null}
    </>
  );
};
