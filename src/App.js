import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import Home from './Home'
import {observer, inject} from 'mobx-react';

@inject('appStore') @observer
class App extends Component {
  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appStore.count = 30
        resolve(true)
      }, 3000)
    })
  }
  render() {
    return (
      <Switch>
        <Route path="/" extra component={Home} />
      </Switch>
    );
  }
}

export default App;
