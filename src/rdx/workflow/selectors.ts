import { RootState } from "../../store";
import { Id } from "../../types";

export const selectActionById = (state: RootState, id: Id) => state.workflow.actionMap[id];

export const selectActionMap = (state: RootState) => state.workflow.actionMap;

export const selectTriggerById = (state: RootState, id: Id) => state.workflow.triggerMap[id];

export const selectTriggerMap = (state: RootState) => state.workflow.triggerMap;
