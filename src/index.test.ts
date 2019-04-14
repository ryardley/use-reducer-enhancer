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
  let calls: any[] = [];

  const middleware1: Middleware = (store: any) => (next: any) => (
    action: any
  ) => {
    calls.push({ mw: "mw1", action });
    return next(action);
  };

  const middleware2: Middleware = (store: any) => (next: any) => (
    action: any
  ) => {
    calls.push({ mw: "mw2", action });
    return next(action);
  };

  it("should wrap the dispatch function of useReducer correctly with a single middleware", () => {
    calls = [];

    const useEnhancedReducer = applyMiddleware(middleware1)(React.useReducer);

    const { result } = renderHook(() =>
      useEnhancedReducer((state: any, action: any) => state, {})
    );

    const [, dispatch] = result.current;
    expect(calls).toEqual([]);
    dispatch({ type: "ONE" });
    expect(calls).toEqual([{ action: { type: "ONE" }, mw: "mw1" }]);
    dispatch({ type: "TWO" });
    expect(calls).toEqual([
      { action: { type: "ONE" }, mw: "mw1" },
      { action: { type: "TWO" }, mw: "mw1" }
    ]);
  });

  it("should wrap the dispatch function of useReducer correctly with two middleware", () => {
    calls = [];

    const useEnhancedReducer = applyMiddleware(middleware1, middleware2)(
      React.useReducer
    );

    const { result } = renderHook(() =>
      useEnhancedReducer((state: any, action: any) => state, {})
    );

    const [, dispatch] = result.current;
    expect(calls).toEqual([]);
    dispatch({ type: "ONE" });
    expect(calls).toEqual([
      { action: { type: "ONE" }, mw: "mw1" },
      { action: { type: "ONE" }, mw: "mw2" }
    ]);
    dispatch({ type: "TWO" });
    expect(calls).toEqual([
      { action: { type: "ONE" }, mw: "mw1" },
      { action: { type: "ONE" }, mw: "mw2" },
      { action: { type: "TWO" }, mw: "mw1" },
      { action: { type: "TWO" }, mw: "mw2" }
    ]);
  });

  // TODO:
  it.skip("should return the same reference for every dispatch", () => {});
});
