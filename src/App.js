import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Trainer from './components/trainer/trainer';
import './App.css';
import Success from './components/success/success';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Trainer}>
        </Route>
        <Route path="/trainer" component={Trainer}>
        </Route>
        <Route path="/success" component={Success}>
        </Route>
      </Switch>
  </BrowserRouter>
  );
}

export default App;
