import { applyMiddleware, UseReducerFn, Middleware } from "./index";
import React from "react";
import { renderHook, cleanup, act } from "react-hooks-testing-library";

beforeEach(cleanup);

describe("when no middleware is provided", () => {
  it("should directly pass the useReducer function with the same reference", () => {
    const enhancer = applyMiddleware();
    const useReducerFn: UseReducerFn<any> = () => [{}, () => {}];
    const enhancedFn = enhancer(useReducerFn);
    expect(enhancedFn).toBe(useReducerFn);
  });
});

describe("when simple middleware is provided", () => {
  // Easier to track calls manually because of middleware closures
  let middleware1Calls = [];
  let middleware2Calls = [];

  const middleware1: Middleware = (store: any) => (next: any) => (
    action: any
  ) => {
    middleware1Calls.push(action);
    return next(action);
  };

  const middleware2: Middleware = (store: any) => (next: any) => (
    action: any
  ) => {
    middleware2Calls.push(action);
    return next(action);
  };

  it("should wrap the dispatch function of useReducer correctly", () => {
    middleware1Calls = [];

    const useEnhancedReducer = applyMiddleware(middleware1)(React.useReducer);

    const { result } = renderHook(() =>
      useEnhancedReducer((state: any, action: any) => state, {})
    );

    const [, dispatch] = result.current;
    expect(middleware1Calls.length).toBe(0);
    dispatch({ type: "TEST" });
    expect(middleware1Calls.length).toBe(1);
    dispatch({ type: "TEST" });
    expect(middleware1Calls.length).toBe(2);
  });

  it("should wrap the dispatch function of useReducer correctly", () => {
    middleware1Calls = [];
    middleware2Calls = [];

    const useEnhancedReducer = applyMiddleware(middleware1, middleware2)(
      React.useReducer
    );

    const { result } = renderHook(() =>
      useEnhancedReducer((state: any, action: any) => state, {})
    );

    const [, dispatch] = result.current;
    expect(middleware1Calls.length).toBe(0);
    expect(middleware2Calls.length).toBe(0);
    dispatch({ type: "TEST" });
    expect(middleware1Calls.length).toBe(1);
    expect(middleware2Calls.length).toBe(1);
    dispatch({ type: "TEST" });
    expect(middleware1Calls.length).toBe(2);
    expect(middleware2Calls.length).toBe(2);
  });
});
