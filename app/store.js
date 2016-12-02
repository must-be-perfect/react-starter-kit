import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import fetchMiddleware from './reducers/utils/fetchMiddleware';
import reducers from './reducers';

const { env: { NODE_ENV, RENDERING_ON } } = process;

function generateCompose(middlewares) {
  if (NODE_ENV === 'development' && RENDERING_ON === 'client') {
    const DevTools = require('./containers/DevTools').default;

    return compose(
      middlewares,
      DevTools.instrument(),
    );
  }

  return compose(
    middlewares,
  );
}

export default (initialState = {}) => {
  const store = createStore(
    reducers,
    initialState,
    generateCompose(
      applyMiddleware(
        fetchMiddleware,
        thunk,
      ),
    ),
  );

  if (NODE_ENV === 'development' && RENDERING_ON === 'client') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        const nextReducers = require('./reducers').default;

        store.replaceReducer(nextReducers);
      });
    }
  }

  return store;
};
