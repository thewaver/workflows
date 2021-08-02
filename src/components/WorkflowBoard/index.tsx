import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActionFetchState,
  selectActionMap,
  selectTriggerFetchState,
  selectTriggerMap,
} from "../../rdx/workflow/selectors";
import {
  addAction,
  addConnection,
  addTrigger,
  redo,
  removeActionById,
  removeConnection,
  removeTriggerById,
  undo,
} from "../../rdx/workflow/slice";
import { Action, APICallState, Connection, EntityKind, Id, Trigger } from "../../types";
import { Modal } from "../Modal";
import { ConfirmEntityRemovalForm } from "../ConfirmEntityRemovalForm";
import { NewTriggerForm } from "../NewTriggerForm";
import { NewActionForm } from "../NewActionForm";
import { VerticalList } from "../VerticalList";
import { ConnectionDisplay } from "../ConnectionDisplay";
import { ConnectionLine } from "../ConnectionLine";
import { WorkflowState } from "./types";
import { ActionEntity } from "../ActionEntity";
import { TriggerEntity } from "../TriggerEntity";
import "./style.css";

interface WorkflowBoardProps {
  actionKeys: Id[];
  triggerKeys: Id[];
  connections: Connection[];
  onActionAdd: () => void;
  onActionRemove: (id: Id) => void;
  onTriggerAdd: () => void;
  onTriggerRemove: (id: Id) => void;
  onConnectionAdd: (actionId: Id, triggerId: Id) => void;
  onConnectionRemove: (actionId: Id, triggerId: Id) => void;
}

const WorkflowBoardCmp: React.FC<WorkflowBoardProps> = memo(
  ({
    actionKeys,
    triggerKeys,
    connections,
    onActionAdd,
    onActionRemove,
    onTriggerAdd,
    onTriggerRemove,
    onConnectionAdd,
    onConnectionRemove,
  }) => {
    const [selectedActionId, setSelectedActionId] = useState<Id>();
    const [selectedTriggerId, setSelectedTriggerId] = useState<Id>();
    const [version, setVersion] = useState(0);

    const handleActionSelect = useCallback((id: Id) => {
      setSelectedActionId((oldId) => (oldId !== id ? id : undefined));
    }, []);

    const handleTriggerSelect = useCallback((id: Id) => {
      setSelectedTriggerId((oldId) => (oldId !== id ? id : undefined));
    }, []);

    const handleConnectionAdd = useCallback(
      (actionId: Id, triggerId: Id) => {
        setSelectedActionId(undefined);
        setSelectedTriggerId(undefined);
        onConnectionAdd(actionId, triggerId);
      },
      [onConnectionAdd],
    );

    const handleChangeWidth = useCallback(() => {
      setVersion((oldVersion) => oldVersion + 1);
    }, []);

    const renderAction = useCallback((id: Id) => <ActionEntity id={id} />, []);

    const renderTrigger = useCallback((id: Id) => <TriggerEntity id={id} />, []);

    useEffect(() => {
      setVersion((oldVersion) => oldVersion + 1);
    }, [actionKeys, triggerKeys]);

    return (
      <div className="WorkflowBoard">
        <VerticalList
          title="trigger"
          itemIds={triggerKeys}
          selectedItemId={selectedTriggerId}
          itemKeyPrefix={EntityKind.Trigger}
          onAdd={onTriggerAdd}
          onSelect={handleTriggerSelect}
          onDelete={onTriggerRemove}
          renderItem={renderTrigger}
        />
        <ConnectionDisplay onChangeWidth={handleChangeWidth}>
          {connections.map((connection) => (
            <ConnectionLine
              key={`${connection.triggerId}_${connection.actionId}`}
              version={version}
              actionId={connection.actionId}
              triggerId={connection.triggerId}
              onClick={onConnectionRemove}
            />
          ))}
          <ConnectionLine
            highlighted
            version={version}
            actionId={selectedActionId}
            triggerId={selectedTriggerId}
            onClick={handleConnectionAdd}
          />
        </ConnectionDisplay>
        <VerticalList
          title="action"
          itemIds={actionKeys}
          selectedItemId={selectedActionId}
          itemKeyPrefix={EntityKind.Action}
          onAdd={onActionAdd}
          onSelect={handleActionSelect}
          onDelete={onActionRemove}
          renderItem={renderAction}
        />
      </div>
    );
  },
);

export const WorkflowBoard = () => {
  const dispatch = useDispatch();
  const actionMap = useSelector(selectActionMap);
  const triggerMap = useSelector(selectTriggerMap);
  const actionFetchState = useSelector(selectActionFetchState);
  const triggerFetchState = useSelector(selectTriggerFetchState);

  const [workflowState, setWorkflowState] = useState(WorkflowState.unset);
  const [idOfEntityBeingRemoved, setIdOfEntityBeingRemoved] = useState<string>();

  const { connectedTriggerKeys, triggerKeys } = useMemo(() => {
    const categorized = Object.keys(triggerMap).reduce(
      (result, currentId) => {
        if (triggerMap[currentId].actionId !== undefined) {
          result.connected.push(currentId);
        } else {
          result.notConnected.push(currentId);
        }

        return result;
      },
      {
        connected: [] as Id[],
        notConnected: [] as Id[],
      },
    );

    return {
      connectedTriggerKeys: categorized.connected,
      notConnectedTriggerKeys: categorized.notConnected,
      triggerKeys: [...categorized.connected, ...categorized.notConnected],
    };
  }, [triggerMap]);

  const { actionKeys } = useMemo(() => {
    const notConnected = Object.keys(actionMap).filter(
      (id) => actionMap[id].triggerId === undefined,
    );

    const connected = connectedTriggerKeys.map((id) => triggerMap[id].actionId as Id);

    return {
      connectedActionKeys: connected,
      notConnectedActionKeys: notConnected,
      actionKeys: [...connected, ...notConnected],
    };
  }, [actionMap, triggerMap, connectedTriggerKeys]);

  const connections = connectedTriggerKeys.map((id) => ({
    actionId: triggerMap[id].actionId as Id,
    triggerId: id,
  }));

  const handleModalClose = useCallback(() => {
    setWorkflowState(WorkflowState.unset);
  }, []);

  const handleActionAdd = useCallback(() => {
    setWorkflowState(WorkflowState.addingAction);
  }, []);

  const handleActionRemove = useCallback((id: Id) => {
    setWorkflowState(WorkflowState.removingAction);
    setIdOfEntityBeingRemoved(id);
  }, []);

  const handleActionSave = useCallback(
    (action: Action) => {
      setWorkflowState(WorkflowState.unset);
      dispatch(addAction(action));
    },
    [dispatch],
  );

  const handleActionRemoveConfirm = useCallback(() => {
    setWorkflowState(WorkflowState.unset);

    if (idOfEntityBeingRemoved !== undefined) {
      dispatch(removeActionById(idOfEntityBeingRemoved));
    }
  }, [dispatch, idOfEntityBeingRemoved]);

  const handleTriggerAdd = useCallback(() => {
    setWorkflowState(WorkflowState.addingTrigger);
  }, []);

  const handleTriggerRemove = useCallback((id: Id) => {
    setWorkflowState(WorkflowState.removingTrigger);
    setIdOfEntityBeingRemoved(id);
  }, []);

  const handleTriggerSave = useCallback(
    (trigger: Trigger) => {
      setWorkflowState(WorkflowState.unset);
      dispatch(addTrigger(trigger));
    },
    [dispatch],
  );

  const handleTriggerRemoveConfirm = useCallback(() => {
    setWorkflowState(WorkflowState.unset);

    if (idOfEntityBeingRemoved !== undefined) {
      dispatch(removeTriggerById(idOfEntityBeingRemoved));
    }
  }, [dispatch, idOfEntityBeingRemoved]);

  const handleConnectionAdd = useCallback(
    (actionId: Id, triggerId: Id) => {
      dispatch(addConnection({ actionId, triggerId }));
    },
    [dispatch],
  );

  const handleConnectionRemove = useCallback(
    (actionId: Id, triggerId: Id) => {
      dispatch(removeConnection({ actionId, triggerId }));
    },
    [dispatch],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            dispatch(redo());
          } else {
            dispatch(undo());
          }
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          dispatch(redo());
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (actionFetchState === APICallState.waiting || triggerFetchState === APICallState.waiting) {
    return <div className="Loading">{"loading..."}</div>;
  }

  if (actionFetchState !== APICallState.success || triggerFetchState !== APICallState.success) {
    return <div className="NoData">{"no data"}</div>;
  }

  return (
    <>
      <WorkflowBoardCmp
        actionKeys={actionKeys}
        triggerKeys={triggerKeys}
        connections={connections}
        onActionAdd={handleActionAdd}
        onActionRemove={handleActionRemove}
        onTriggerAdd={handleTriggerAdd}
        onTriggerRemove={handleTriggerRemove}
        onConnectionAdd={handleConnectionAdd}
        onConnectionRemove={handleConnectionRemove}
      />
      {workflowState !== WorkflowState.unset ? (
        <Modal onClose={handleModalClose}>
          {workflowState === WorkflowState.addingAction ? (
            <NewActionForm onCancel={handleModalClose} onSave={handleActionSave} />
          ) : null}
          {workflowState === WorkflowState.addingTrigger ? (
            <NewTriggerForm onCancel={handleModalClose} onSave={handleTriggerSave} />
          ) : null}
          {workflowState === WorkflowState.removingAction &&
          idOfEntityBeingRemoved !== undefined ? (
            <ConfirmEntityRemovalForm
              entityKind={EntityKind.Action}
              onCancel={handleModalClose}
              onConfirm={handleActionRemoveConfirm}
            >
              <ActionEntity id={idOfEntityBeingRemoved} />
            </ConfirmEntityRemovalForm>
          ) : null}
          {workflowState === WorkflowState.removingTrigger &&
          idOfEntityBeingRemoved !== undefined ? (
            <ConfirmEntityRemovalForm
              entityKind={EntityKind.Trigger}
              onCancel={handleModalClose}
              onConfirm={handleTriggerRemoveConfirm}
            >
              <TriggerEntity id={idOfEntityBeingRemoved} />
            </ConfirmEntityRemovalForm>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
};
