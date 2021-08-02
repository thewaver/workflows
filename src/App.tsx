import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WorkflowBoard } from "./components/WorkflowBoard";
import {
  setActionsFailure,
  setActionsStart,
  setActionsSuccess,
  setTriggersFailure,
  setTriggersStart,
  setTriggersSuccess,
} from "./rdx/workflow/slice";
import { API } from "./API";
import "./App.css";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActionsStart());
    API.getActions()
      .then((actions) => {
        dispatch(setActionsSuccess(actions));
      })
      .catch((e) => dispatch(setActionsFailure()));

    dispatch(setTriggersStart());
    API.getTriggers()
      .then((triggers) => {
        dispatch(setTriggersSuccess(triggers));
      })
      .catch((e) => dispatch(setTriggersFailure()));
  }, [dispatch]);

  return (
    <div className="App">
      <WorkflowBoard />
    </div>
  );
};

export default App;
