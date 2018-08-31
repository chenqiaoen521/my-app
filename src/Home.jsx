import React, { Component } from 'react';
import logo from './logo.svg';
import Helmet from 'react-helmet';
import './App.css';
import {observer, inject} from 'mobx-react';
@inject('appStore') @observer
class App extends Component {
  render() {
    return (
      <div className="App">
        <Helmet>
          <title>home</title>
          <meta name="description" content="this is home page"/>
        </Helmet>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {this.props.appStore.count}
        </p>
        <button onClick={()=>{this.props.appStore.count ++}}></button>
      </div>
    );
  }
}

export default App;
