import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Action, Connection, Id, Trigger } from "../../types";

interface WorkFlowStateBase {
  actionMap: Record<Id, Action>;
  triggerMap: Record<Id, Trigger>;
}

interface WorkflowState {
  current: WorkFlowStateBase;
  past: WorkFlowStateBase[];
  future: WorkFlowStateBase[];
}

const initialState: WorkflowState = {
  current: {
    actionMap: {},
    triggerMap: {},
  },
  past: [],
  future: [],
};

// state: WritableDraft<WorkflowState> - type is not exported
const addToStateHistory = (state: any) => {
  state.past = state.past.concat([state.current]);
  state.future = [];
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  reducers: {
    undo: (state, action: PayloadAction<void>) => {
      if (state.past.length > 0) {
        state.future = state.future.concat([state.current]);
        state.current = state.past[state.past.length - 1];
        state.past = state.past.slice(0, state.past.length - 1);
      }
    },

    redo: (state, action: PayloadAction<void>) => {
      if (state.future.length > 0) {
        state.past = state.past.concat([state.current]);
        state.current = state.future[state.future.length - 1];
        state.future = state.future.slice(0, state.future.length - 1);
      }
    },

    addAction: (state, action: PayloadAction<Action>) => {
      state.current.actionMap[action.payload.id] = action.payload;
      addToStateHistory(state);
    },

    removeActionById: (state, action: PayloadAction<Id>) => {
      delete state.current.actionMap[action.payload];

      for (let value of Object.values(state.current.triggerMap)) {
        if (value.actionId === action.payload) {
          value.actionId = undefined;
        }
      }

      addToStateHistory(state);
    },

    setActions: (state, action: PayloadAction<Action[]>) => {
      state.current.actionMap = action.payload.reduce((mappedActions, currentAction) => {
        mappedActions[currentAction.id] = currentAction;
        return mappedActions;
      }, {} as Record<Id, Action>);
    },

    addConnection: (state, action: PayloadAction<Connection>) => {
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

      addToStateHistory(state);
    },

    removeConnection: (state, action: PayloadAction<Connection>) => {
      const existingAction = state.current.actionMap[action.payload.actionId];
      const existingTrigger = state.current.triggerMap[action.payload.triggerId];

      if (existingAction) {
        existingAction.triggerId = undefined;
      }

      if (existingTrigger) {
        existingTrigger.actionId = undefined;
      }

      addToStateHistory(state);
    },

    addTrigger: (state, action: PayloadAction<Trigger>) => {
      state.current.triggerMap[action.payload.id] = action.payload;
      addToStateHistory(state);
    },

    removeTriggerById: (state, action: PayloadAction<Id>) => {
      delete state.current.triggerMap[action.payload];

      for (let value of Object.values(state.current.actionMap)) {
        if (value.triggerId === action.payload) {
          value.triggerId = undefined;
        }
      }

      addToStateHistory(state);
    },

    setTriggers: (state, action: PayloadAction<Trigger[]>) => {
      state.current.triggerMap = action.payload.reduce((mappedTriggers, currentTrigger) => {
        mappedTriggers[currentTrigger.id] = currentTrigger;
        return mappedTriggers;
      }, {} as Record<Id, Action>);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addAction,
  removeActionById,
  setActions,
  addConnection,
  removeConnection,
  addTrigger,
  removeTriggerById,
  setTriggers,
} = workflowSlice.actions;

export default workflowSlice.reducer;
