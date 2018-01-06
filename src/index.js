import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import registerServiceWorker from './registerServiceWorker';

import MineSweeperStore from './reducers/index';
import MineSweeper from './containers/MineSweeper';

import './index.css';

const store = createStore(MineSweeperStore);

// store.subscribe(() => {
// 	console.log(store.getState())
// });

ReactDOM.render(
  <Provider store={store}>
    <MineSweeper />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
