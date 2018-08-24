import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import Home from './Home'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" extra component={Home} />
      </Switch>
    );
  }
}

export default App;
