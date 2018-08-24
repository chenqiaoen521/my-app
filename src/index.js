import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppContainer } from 'react-hot-loader';
import {AppState} from './store/store'
import {Provider} from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';

const appState = new AppState();
setInterval(() => {
  appState.add()
}, 300)

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
const render = (Component) => {
  renderMethod(
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};
render(App)

if (module.hot) {
	module.hot.accept('./App', ()=> {
    const NextApp = require('./App').default
    render(NextApp)
  })
}

