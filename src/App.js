import React from 'react';
import Trainer from './components/trainer/trainer';
import './App.css';
import Success from './components/success/success';
import NewTrainer from './components/newTrainer/newTrainer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Trainer/>
        </Route>
        <Route path="/trainer" component={Trainer}>
        </Route>
        <Route path="/success" component={Success}>
        </Route>
        <Route path="/new">
          <NewTrainer />
        </Route>
        <PrivateRoute path="/success">
          <Success />
        </PrivateRoute>
      </Switch>
  </Router>
  );

  function PrivateRoute({ children, ...rest }) {    
    return (
            <Redirect
              to={{
                pathname: "/new",
                state: { from: '/success' }
              }}
            />
    );
  }
}

export default App;
