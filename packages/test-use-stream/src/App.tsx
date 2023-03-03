import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { CounterPage } from './Counter';
import { IntervalPage } from './Interval';

function Home() {
  return (
    <div className='menu'>
      <ul>
        <li>
          <Link to='/Counter'>Counter</Link>
        </li>
        <li>
          <Link to='/Interval'>Interval</Link>
        </li>
      </ul>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Counter' element={<CounterPage />} />
        <Route path='/Interval' element={<IntervalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export function App() {
  return <AppRoutes />;
}
