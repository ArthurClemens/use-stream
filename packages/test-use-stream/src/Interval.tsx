import flyd from 'flyd';
import React from 'react';
import { useStream } from 'use-stream';

const INIT_VALUES = [0, 500];
const UNIT = 500;

// Code comments at https://james-forbes.com/#!/posts/hooks-and-streams
const interval = ({ delay }: { delay: flyd.Stream<number> }) => {
  const id: flyd.Stream<number> = flyd.stream();
  const tick: flyd.Stream<number> = flyd.stream();

  delay.map((delayValue: number) => {
    clearInterval(id());
    id(window.setInterval(tick, delayValue, delay));
    return null;
  });

  delay.end.map(() => {
    clearInterval(id());
    return null;
  });

  return tick;
};

type TModel = {
  delay: flyd.Stream<number>;
  count: flyd.Stream<number>;
};

type TCounter = {
  initCount: number;
  initDelay: number;
};

function Counter(props: TCounter) {
  const model = useStream<TModel>({
    model: () => {
      const delay = flyd.stream(props.initDelay);
      const count = flyd.stream(props.initCount);

      return {
        delay,
        count,
      };
    },
    defer: true,
    deps: [props.initCount],
    onMount: ({ count, delay }) => {
      const tick = interval({ delay });
      tick.map(() => count(count() + 1));
    },
    onUpdate: ({ count, delay }) => {
      delay.end(); // Clean up side effects
      const tick = interval({ delay });
      tick.map(() => count(count() + 1));
    },
    onDestroy: model1 => {
      if (model1 && model1?.delay?.()) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        delay.end(true); // Clean up side effects
      }
    },
  });

  const { count, delay, isDeferred } = model;
  if (isDeferred) {
    return null;
  }

  return (
    <div className='ui segment form demo-section'>
      <h2 className='ui header' data-testid='count'>
        {count()}
      </h2>
      <h3
        className='ui header'
        data-testid='delay'
      >{`Delay: ${delay()} ms`}</h3>
      <p>
        <button
          type='button'
          className='ui button primary'
          onClick={() => delay(delay() + UNIT)}
          data-testid='btn-slower'
        >
          Slower
        </button>
        <button
          type='button'
          className='ui button primary'
          onClick={() => delay(delay() - UNIT)}
          disabled={delay() === UNIT}
          data-testid='btn-faster'
        >
          Faster
        </button>
      </p>
    </div>
  );
}

export function IntervalPage() {
  return <Counter initCount={INIT_VALUES[0]} initDelay={INIT_VALUES[1]} />;
}
