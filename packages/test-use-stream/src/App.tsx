import React, { FunctionComponent } from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';

import { IntervalPage } from './Interval';
import { CounterPage } from './Counter';

export type TRoutes = {
  [key: string]: FunctionComponent<unknown>;
};

const routes: TRoutes = {};

const Home: FunctionComponent<{}> = () => (
  <div className="menu">
    <ul>
      {Object.keys(routes)
        .filter(path => path.substr(1))
        .map(path => (
          <li key={path}>
            <Link to={path}>{path.substr(1)}</Link>
          </li>
        ))}
    </ul>
  </div>
);

routes['/'] = Home;
routes['/IntervalPage'] = IntervalPage;
routes['/CounterPage'] = CounterPage;

export const App = () => (
  <Router>
    <Switch>
      {Object.keys(routes).map(path => (
        <Route key={path} path={path} exact component={routes[path]} />
      ))}
    </Switch>
  </Router>
);
