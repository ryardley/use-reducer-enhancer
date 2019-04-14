# use-reducer-enhancer

This package allows you to use standard Redux middleware with React Hooks' `useReducer` hook.

You might want to consider this experimental but it has so far been tested with:

* [Thunk](examples/thunk)

## Contibuting 

PR's and issues most welcome! 

## Install

```
$ npm install --save use-reducer-enhancer
```

or

```
$ yarn add use-reducer-enhancer
```

## Why did you build this?

I needed a way to manage asynchronous code within state diaspatch logic and thought it made sense to wrap the existing middleware patterns we use in redux so they can be applied to useReducer.

## API

The package provides a named export `applyMiddleware` that can create an enahancer that can be used to wrap `useReducer` with middleware.

```javascript
import { applyMiddleware } from "use-reducer-enhancer";

const enhancer = applyMiddleware(thunk, loggingMiddleware);
const useEnhancedReducer = enhancer(useReducer);
```

## Usage Example

```javascript
import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import React, { useReducer } from "react";

// Enhance useReducer with middleware
const enhancer = applyMiddleware(thunk);
const useReducerWithThunk = enhancer(useReducer);

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const LOADING = "LOADING";

function incrementSlowly() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.loading) return;

    dispatch({ type: LOADING });

    setTimeout(() => {
      dispatch({ type: INCREMENT });
    }, 300);
  };
}

function decrementSlowly() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.loading) return;

    dispatch({ type: LOADING });

    setTimeout(() => {
      dispatch({ type: DECREMENT });
    }, 300);
  };
}

function reducer(state, action) {
  switch (action.type) {
    case INCREMENT: {
      return {
        ...state,
        count: state.count + 1,
        loading: false
      };
    }
    case DECREMENT: {
      return {
        ...state,
        count: state.count - 1,
        loading: false
      };
    }
    case LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    default:
  }
}

export default function Counter({ initState = { count: 0 } }) {
  // Use the new `useReducer` like the normal hook
  const [state, dispatch] = useReducerWithThunk(reducer, initState);

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch(incrementSlowly())}>+</button>
      <button onClick={() => dispatch(decrementSlowly())}>-</button>
      {state.loading && <div>Hold on...</div>}
    </div>
  );
}
```
