import React, { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActionMap, selectTriggerMap } from "../../rdx/workflow/selectors";
import {
  addAction,
  addTrigger,
  removeActionById,
  removeTriggerById,
} from "../../rdx/workflow/slice";
import { Action, Id, Trigger } from "../../types";
import { Modal } from "../Modal";
import { NewTriggerForm } from "../NewTriggerForm";
import { NewActionForm } from "../NewActionForm";
import { VerticalList } from "../VerticalList";
import { ConnectionDisplay } from "../ConnectionDisplay";
import { WorkflowState } from "./types";
import "./style.css";

interface WorkflowBoardProps {
  actionMap: Record<Id, Action>;
  triggerMap: Record<Id, Trigger>;
  onActionAdd: () => void;
  onActionDelete: (id: Id) => void;
  onTriggerAdd: () => void;
  onTriggerDelete: (id: Id) => void;
}

const WorkflowBoardCmp: React.FC<WorkflowBoardProps> = memo(
  ({ actionMap, triggerMap, onActionAdd, onActionDelete, onTriggerAdd, onTriggerDelete }) => {
    const [selectedActionId, setSelectedActionId] = useState<Id>();
    const [selectedTriggerId, setSelectedTriggerId] = useState<Id>();

    const actionKeys = useMemo(() => Object.keys(actionMap), [actionMap]);
    const triggerKeys = useMemo(() => Object.keys(triggerMap), [triggerMap]);

    const handleActionSelect = useCallback((id: Id) => {
      setSelectedActionId(id);
    }, []);

    const handleTriggerSelect = useCallback((id: Id) => {
      setSelectedTriggerId(id);
    }, []);

    const renderAction = useCallback((id: Id) => <>{actionMap[id].name}</>, [actionMap]);

    const renderTrigger = useCallback((id: Id) => <>{triggerMap[id].name}</>, [triggerMap]);

    return (
      <div className="WorkflowBoard">
        <div className="Board">
          <VerticalList
            title="trigger"
            itemIds={triggerKeys}
            selectedItemId={selectedTriggerId}
            onAdd={onTriggerAdd}
            onSelect={handleTriggerSelect}
            onDelete={onTriggerDelete}
            renderItem={renderTrigger}
          />
          <ConnectionDisplay />
          <VerticalList
            title="action"
            itemIds={actionKeys}
            selectedItemId={selectedActionId}
            onAdd={onActionAdd}
            onSelect={handleActionSelect}
            onDelete={onActionDelete}
            renderItem={renderAction}
          />
        </div>
        <div className="Info">{"Some description goes here."}</div>
      </div>
    );
  },
);

export const WorkflowBoard = () => {
  const dispatch = useDispatch();
  const actionMap = useSelector(selectActionMap);
  const triggerMap = useSelector(selectTriggerMap);

  const [workflowState, setWorkflowState] = useState(WorkflowState.unset);

  const isAddingEntity =
    workflowState === WorkflowState.addingAction || workflowState === WorkflowState.addingTrigger;

  const handleModalClose = useCallback(() => {
    setWorkflowState(WorkflowState.unset);
  }, []);

  const handleActionAdd = useCallback(() => {
    setWorkflowState(WorkflowState.addingAction);
  }, []);

  const handleActionSave = useCallback(
    (action: Action) => {
      setWorkflowState(WorkflowState.unset);
      dispatch(addAction(action));
    },
    [dispatch],
  );

  const handleActionDelete = useCallback(
    (id: Id) => {
      dispatch(removeActionById(id));
    },
    [dispatch],
  );

  const handleTriggerAdd = useCallback(() => {
    setWorkflowState(WorkflowState.addingTrigger);
  }, []);

  const handleTriggerSave = useCallback(
    (trigger: Trigger) => {
      setWorkflowState(WorkflowState.unset);
      dispatch(addTrigger(trigger));
    },
    [dispatch],
  );

  const handleTriggerDelete = useCallback(
    (id: Id) => {
      dispatch(removeTriggerById(id));
    },
    [dispatch],
  );

  return (
    <>
      <WorkflowBoardCmp
        actionMap={actionMap}
        triggerMap={triggerMap}
        onActionAdd={handleActionAdd}
        onActionDelete={handleActionDelete}
        onTriggerAdd={handleTriggerAdd}
        onTriggerDelete={handleTriggerDelete}
      />
      {isAddingEntity ? (
        <Modal onClose={handleModalClose}>
          {workflowState === WorkflowState.addingAction ? (
            <NewActionForm onCancel={handleModalClose} onSave={handleActionSave} />
          ) : null}
          {workflowState === WorkflowState.addingTrigger ? (
            <NewTriggerForm onCancel={handleModalClose} onSave={handleTriggerSave} />
          ) : null}
        </Modal>
      ) : null}
    </>
  );
};
