import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import deepCopy from "deep-copy";
import { Action, APICallState, Connection, Id, Trigger } from "../../types";

interface WorkFlowStateBase {
  actionMap: Record<Id, Action>;
  triggerMap: Record<Id, Trigger>;
}

interface WorkflowState {
  current: WorkFlowStateBase;
  past: WorkFlowStateBase[];
  future: WorkFlowStateBase[];
  actionFetchSate: APICallState;
  triggerFetchState: APICallState;
}

const initialState: WorkflowState = {
  current: {
    actionMap: {},
    triggerMap: {},
  },
  past: [],
  future: [],
  actionFetchSate: APICallState.unset,
  triggerFetchState: APICallState.unset,
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        state.future.push(deepCopy(state.current));
        state.current = deepCopy(state.past[state.past.length - 1]);
        state.past.pop();
      }
    },

    redo: (state) => {
      if (state.future.length > 0) {
        state.past.push(deepCopy(state.current));
        state.current = deepCopy(state.future[state.future.length - 1]);
        state.future.pop();
      }
    },

    addAction: (state, action: PayloadAction<Action>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];
      state.current.actionMap[action.payload.id] = action.payload;
    },

    removeActionById: (state, action: PayloadAction<Id>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];

      delete state.current.actionMap[action.payload];

      for (let value of Object.values(state.current.triggerMap)) {
        if (value.actionId === action.payload) {
          value.actionId = undefined;
        }
      }
    },

    setActionsStart: (state) => {
      state.actionFetchSate = APICallState.waiting;
    },

    setActionsFailure: (state) => {
      state.actionFetchSate = APICallState.failure;
    },

    setActionsSuccess: (state, action: PayloadAction<Action[]>) => {
      state.current.actionMap = action.payload.reduce((mappedActions, currentAction) => {
        mappedActions[currentAction.id] = currentAction;
        return mappedActions;
      }, {} as Record<Id, Action>);
      state.actionFetchSate = APICallState.success;
    },

    addConnection: (state, action: PayloadAction<Connection>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];

      const existingAction = state.current.actionMap[action.payload.actionId];
      const existingTrigger = state.current.triggerMap[action.payload.triggerId];

      if (existingAction?.triggerId) {
        const oldTrigger = state.current.triggerMap[existingAction.triggerId];

        if (oldTrigger) {
          oldTrigger.actionId = undefined;
        }
      }

      if (existingTrigger?.actionId) {
        const oldAction = state.current.actionMap[existingTrigger.actionId];

        if (oldAction) {
          oldAction.triggerId = undefined;
        }
      }

      if (existingAction && existingTrigger) {
        existingAction.triggerId = action.payload.triggerId;
        existingTrigger.actionId = action.payload.actionId;
      }
    },

    removeConnection: (state, action: PayloadAction<Connection>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];

      const existingAction = state.current.actionMap[action.payload.actionId];
      const existingTrigger = state.current.triggerMap[action.payload.triggerId];

      if (existingAction) {
        existingAction.triggerId = undefined;
      }

      if (existingTrigger) {
        existingTrigger.actionId = undefined;
      }
    },

    addTrigger: (state, action: PayloadAction<Trigger>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];
      state.current.triggerMap[action.payload.id] = action.payload;
    },

    removeTriggerById: (state, action: PayloadAction<Id>) => {
      state.past.push(deepCopy(state.current));
      state.future = [];

      delete state.current.triggerMap[action.payload];

      for (let value of Object.values(state.current.actionMap)) {
        if (value.triggerId === action.payload) {
          value.triggerId = undefined;
        }
      }
    },

    setTriggersStart: (state) => {
      state.triggerFetchState = APICallState.waiting;
    },

    setTriggersFailure: (state) => {
      state.triggerFetchState = APICallState.failure;
    },

    setTriggersSuccess: (state, action: PayloadAction<Trigger[]>) => {
      state.current.triggerMap = action.payload.reduce((mappedTriggers, currentTrigger) => {
        mappedTriggers[currentTrigger.id] = currentTrigger;
        return mappedTriggers;
      }, {} as Record<Id, Action>);
      state.triggerFetchState = APICallState.success;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  undo,
  redo,
  addAction,
  removeActionById,
  setActionsStart,
  setActionsFailure,
  setActionsSuccess,
  addConnection,
  removeConnection,
  addTrigger,
  removeTriggerById,
  setTriggersStart,
  setTriggersFailure,
  setTriggersSuccess,
} = workflowSlice.actions;

export default workflowSlice.reducer;
