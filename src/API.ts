import { Action, Trigger } from "./types";

const mockActions: Action[] = [
  {
    id: "doSomething",
    name: "do something",
  },
  {
    id: "doSomethingElse",
    name: "do something else",
  },
  {
    id: "doSomethingSlowly",
    name: "do something slowly",
  },
  {
    id: "doSomethingWithAlacrity",
    name: "do something with alacrity",
  },
];

const mockTriggers: Trigger[] = [
  {
    id: "onSomething",
    name: "on something",
  },
  {
    id: "onSomethingElse",
    name: "on something else",
  },
  {
    id: "onSomethingFast",
    name: "on something fast",
  },
  {
    id: "onSomethingVerySad",
    name: "on something very sad",
  },
];

const mockAPICall = <T>(data: T) => {
  return new Promise<T>((resolve, _reject) => {
    setTimeout(() => resolve(data), 500);
  });
};

export class API {
  static getActions = () => mockAPICall(mockActions);
  static getTriggers = () => mockAPICall(mockTriggers);
}
