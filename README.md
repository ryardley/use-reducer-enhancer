 
# use-reducer-enhancer ✨

This package allows you to use React Hooks' `useReducer` hook with standard Redux middleware.

## Work with Redux middleware using React Hooks 🎣

This package appears to work for basic usecases in non performance critical settings but I would consider it experimental for the time being.

So far this library has been found to work with:

* [Thunk](examples/thunk)
* *[Click here](https://github.com/ryardley/use-reducer-enhancer/pulls) to add your favourite middleware!*

...more to come

## Install

```
$ npm install --save use-reducer-enhancer
```

or

```
$ yarn add use-reducer-enhancer
```

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

## Why did you build this?

I needed a way to manage asynchronous code within state diaspatch logic and thought it made sense to wrap the existing middleware patterns we use in redux so they can be applied to useReducer.

## Contibuting 

PR's and issues most welcome! 
