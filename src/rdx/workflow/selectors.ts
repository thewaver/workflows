import { RootState } from "../../store";
import { Id } from "../../types";

export const selectActionById = (state: RootState, id: Id) => state.workflow.current.actionMap[id];

export const selectActionMap = (state: RootState) => state.workflow.current.actionMap;

export const selectTriggerById = (state: RootState, id: Id) =>
  state.workflow.current.triggerMap[id];

export const selectTriggerMap = (state: RootState) => state.workflow.current.triggerMap;
