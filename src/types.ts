export type Id = string;

export interface Entity {
  id: Id;
  name: string;
}

export enum EntityKind {
  Action = "Action",
  Trigger = "Trigger",
}

export interface Action extends Entity {
  triggerId?: Id;
}

export interface Connection {
  actionId: Id;
  triggerId: Id;
}

export interface Trigger extends Entity {
  actionId?: Id;
}

export enum APICallState {
  unset,
  waiting,
  success,
  failure,
}
