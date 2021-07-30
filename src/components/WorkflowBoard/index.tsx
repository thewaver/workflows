import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActionMap, selectTriggerMap } from "../../rdx/workflow/selectors";
import {
  addAction,
  addConnection,
  addTrigger,
  removeActionById,
  removeConnection,
  removeTriggerById,
} from "../../rdx/workflow/slice";
import { Action, EntityKind, Id, Trigger } from "../../types";
import { Modal } from "../Modal";
import { NewTriggerForm } from "../NewTriggerForm";
import { NewActionForm } from "../NewActionForm";
import { VerticalList } from "../VerticalList";
import { ConnectionDisplay } from "../ConnectionDisplay";
import { Connection } from "../Connection";
import { WorkflowState } from "./types";
import "./style.css";

interface WorkflowBoardProps {
  actionMap: Record<Id, Action>;
  triggerMap: Record<Id, Trigger>;
  onActionAdd: () => void;
  onActionDelete: (id: Id) => void;
  onTriggerAdd: () => void;
  onTriggerDelete: (id: Id) => void;
  onConnectionAdd: (actionId: Id, triggerId: Id) => void;
  onConnectionDelete: (actionId: Id, triggerId: Id) => void;
}

const WorkflowBoardCmp: React.FC<WorkflowBoardProps> = memo(
  ({
    actionMap,
    triggerMap,
    onActionAdd,
    onActionDelete,
    onTriggerAdd,
    onTriggerDelete,
    onConnectionAdd,
    onConnectionDelete,
  }) => {
    const [selectedActionId, setSelectedActionId] = useState<Id>();
    const [selectedTriggerId, setSelectedTriggerId] = useState<Id>();
    const [version, setVersion] = useState(0);

    const triggerKeys = useMemo(() => {
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

      return [...categorized.connected, ...categorized.notConnected];
    }, [triggerMap]);

    const actionKeys = useMemo(() => {
      const notConnected = Object.keys(actionMap).filter(
        (id) => actionMap[id].triggerId === undefined,
      );

      const connected = triggerKeys.reduce((result, currentId) => {
        const actionId = triggerMap[currentId].actionId;

        if (actionId) {
          result.push(actionId);
        }

        return result;
      }, [] as Id[]);

      return [...connected, ...notConnected];
    }, [actionMap, triggerMap, triggerKeys]);

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

    const renderAction = useCallback((id: Id) => <>{actionMap[id].name}</>, [actionMap]);

    const renderTrigger = useCallback((id: Id) => <>{triggerMap[id].name}</>, [triggerMap]);

    useEffect(() => {
      setVersion((oldVersion) => oldVersion + 1);
    }, [actionMap, triggerMap]);

    return (
      <div className="WorkflowBoard">
        <div className="Board">
          <VerticalList
            title="trigger"
            itemIds={triggerKeys}
            selectedItemId={selectedTriggerId}
            itemKeyPrefix={EntityKind.Trigger}
            onAdd={onTriggerAdd}
            onSelect={handleTriggerSelect}
            onDelete={onTriggerDelete}
            renderItem={renderTrigger}
          />
          <ConnectionDisplay onChangeWidth={handleChangeWidth}>
            {triggerKeys.map((id) => {
              const trigger = triggerMap[id];

              if (trigger.actionId) {
                return (
                  <Connection
                    key={`${id}_${trigger.actionId}`}
                    version={version}
                    actionId={trigger.actionId}
                    triggerId={id}
                    onClick={onConnectionDelete}
                  />
                );
              }

              return null;
            })}
            <Connection
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
      console.log("WorkflowBoard.handleActionSave", action);

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

  const handleConnectionAdd = useCallback(
    (actionId: Id, triggerId: Id) => {
      dispatch(addConnection({ actionId, triggerId }));
    },
    [dispatch],
  );

  const handleConnectionDelete = useCallback(
    (actionId: Id, triggerId: Id) => {
      dispatch(removeConnection({ actionId, triggerId }));
    },
    [dispatch],
  );

  return (
    <div aria-hidden={!isAddingEntity}>
      <WorkflowBoardCmp
        actionMap={actionMap}
        triggerMap={triggerMap}
        onActionAdd={handleActionAdd}
        onActionDelete={handleActionDelete}
        onTriggerAdd={handleTriggerAdd}
        onTriggerDelete={handleTriggerDelete}
        onConnectionAdd={handleConnectionAdd}
        onConnectionDelete={handleConnectionDelete}
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
    </div>
  );
};
