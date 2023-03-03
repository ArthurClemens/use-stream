import './styles.css';

import flyd from 'flyd';
import { useStream } from 'use-stream';
import React from 'react';

type TModel = {
  count: flyd.Stream<number>;
};

type Props = {
  id: string;
  count: number;
};

function Counter(props: Props) {
  const { count } = useStream<TModel>({
    model: {
      count: flyd.stream(props.count),
    },
  });
  return (
    <div
      className='ui segment form demo-section'
      data-testid={`counter-${props.id}`}
    >
      <h2 className='ui header'>
        Counter
        {props.id}
      </h2>
      <h3 className='ui header' data-testid='count'>
        {count()}
      </h3>
      <p>
        <button
          type='button'
          className='ui button primary'
          onClick={() => count(count() - 1)}
          disabled={count() === 0}
          data-testid='btn-decrement'
        >
          Decrement
        </button>
        <button
          type='button'
          className='ui button primary'
          onClick={() => count(count() + 1)}
          disabled={count() === 100}
          data-testid='btn-increment'
        >
          Increment
        </button>
      </p>
    </div>
  );
}

export function CounterPage() {
  return (
    <>
      <div className='ui medium header demo-title'>
        useStream with Flyd example: Simple counter
      </div>
      <Counter id='1' count={0} />
      <Counter id='2' count={100} />
    </>
  );
}
