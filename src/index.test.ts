import { applyMiddleware, UseReducerFn } from "./index";

describe("when it has no middleware", () => {
  it("should directly pass an unchanged reducer", () => {
    const enhancer = applyMiddleware();
    const useReducerFn: UseReducerFn = () => [{}, () => {}];
    const enhancedFn = enhancer(useReducerFn);
    expect(enhancedFn).toBe(useReducerFn);
  });
});
