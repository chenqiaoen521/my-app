import React from 'react';
import App from './App';
import {StaticRouter} from 'react-router-dom';
import {Provider, useStaticRendering} from 'mobx-react';
export {createStoreMap} from './store/store';
// mobx 不会重复数据变换
useStaticRendering(true);

export default (stores, routerContext, url) => (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <App />
      </StaticRouter>
    </Provider>
  );