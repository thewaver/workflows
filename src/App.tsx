import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WorkflowBoard } from "./components/WorkflowBoard";
import { setActions, setTriggers } from "./rdx/workflow/slice";
import { API } from "./API";
import "./App.css";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    API.getActions().then((actions) => {
      dispatch(setActions(actions));
    });

    API.getTriggers().then((triggers) => {
      dispatch(setTriggers(triggers));
    });
  }, [dispatch]);

  return (
    <div className="App">
      <WorkflowBoard />
    </div>
  );
};

export default App;
