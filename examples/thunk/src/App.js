import { applyMiddleware } from "use-reducer-enhancer";
import thunk from "redux-thunk";
import React, { useReducer } from "react";

// Enhance useReducer with middleware
const useReducerWithThunk = applyMiddleware(thunk)(useReducer);

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
