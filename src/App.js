import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './Home'
import {observer, inject} from 'mobx-react';


class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/main"  component={Home} />
        <Redirect exact from="/" to="/main" />
      </Switch>
    )
  }
}
export default App;