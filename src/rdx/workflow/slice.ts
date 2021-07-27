import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Action, Connection, Id, Trigger } from "../../types";

interface WorkflowState {
  actionMap: Record<Id, Action>;
  triggerMap: Record<Id, Trigger>;
}

const initialState: WorkflowState = {
  actionMap: {},
  triggerMap: {},
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  reducers: {
    addAction: (state, action: PayloadAction<Action>) => {
      state.actionMap[action.payload.id] = action.payload;
    },

    removeActionById: (state, action: PayloadAction<Id>) => {
      delete state.actionMap[action.payload];

      for (let value of Object.values(state.triggerMap)) {
        if (value.actionId === action.payload) {
          value.actionId = undefined;
        }
      }
    },

    setActions: (state, action: PayloadAction<Action[]>) => {
      state.actionMap = action.payload.reduce((mappedActions, currentAction) => {
        mappedActions[currentAction.id] = currentAction;
        return mappedActions;
      }, {} as Record<Id, Action>);
    },

    addConnection: (state, action: PayloadAction<Connection>) => {
      const existingAction = state.actionMap[action.payload.actionId];
      const existingTrigger = state.triggerMap[action.payload.triggerId];

      if (existingAction && existingTrigger) {
        existingAction.triggerId = action.payload.triggerId;
        existingTrigger.actionId = action.payload.actionId;
      }
    },

    removeConnection: (state, action: PayloadAction<Connection>) => {
      const existingAction = state.actionMap[action.payload.actionId];
      const existingTrigger = state.triggerMap[action.payload.triggerId];

      if (existingAction) {
        existingAction.triggerId = undefined;
      }

      if (existingTrigger) {
        existingTrigger.actionId = undefined;
      }
    },

    addTrigger: (state, action: PayloadAction<Trigger>) => {
      state.triggerMap[action.payload.id] = action.payload;
    },

    removeTriggerById: (state, action: PayloadAction<Id>) => {
      delete state.triggerMap[action.payload];

      for (let value of Object.values(state.actionMap)) {
        if (value.triggerId === action.payload) {
          value.triggerId = undefined;
        }
      }
    },

    setTriggers: (state, action: PayloadAction<Trigger[]>) => {
      state.triggerMap = action.payload.reduce((mappedTriggers, currentTrigger) => {
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
