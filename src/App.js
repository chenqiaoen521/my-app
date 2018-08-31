import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
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
        <Route path="/main"  component={Home} />
        <Redirect exact from="/" to="/main" />
      </Switch>
    );
  }
}
export default App;