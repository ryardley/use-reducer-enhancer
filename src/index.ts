export type ReducerFn<T extends object = {}> = (
  state: T,
  action: { type: string }
) => T;
export type Action = { type: string; [k: string]: any };
type DispatchFn = (...args: any[]) => any; // dispatch might actually accept a function
type DispatchDecorator = (...args: DispatchFn[]) => DispatchFn;
type Store<T extends object = {}> = {
  getState: () => T;
  dispatch: DispatchFn;
};

import { Reducer, ReducerState, ReducerAction, Dispatch } from "react";

export type UseReducerFn<R extends Reducer<any, any>> = (
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined
) => [ReducerState<R>, Dispatch<ReducerAction<R>>];

export type Middleware = (
  store: Store
) => (next: DispatchFn) => (action: Action) => any;

export type Enhancer = (fn: UseReducerFn<any>) => UseReducerFn<any>;

function compose(...funcs: DispatchDecorator[]): DispatchDecorator {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function applyMiddleware(...middlewares: Middleware[]): Enhancer {
  return useReducerHook => {
    if (middlewares.length === 0) {
      return useReducerHook;
    }

    const useReducerFn: UseReducerFn<any> = (reducer, initialState, initFn) => {
      const [state, dispatch] = useReducerHook(reducer, initialState, initFn);
      if (!middlewares) {
        return [state, dispatch];
      }

      const chain = middlewares.map(middleware =>
        middleware({
          getState: () => state,
          dispatch
        })
      );

      const composedDispatch = compose(...chain)(dispatch);

      return [state, composedDispatch];
    };
    return useReducerFn;
  };
}
