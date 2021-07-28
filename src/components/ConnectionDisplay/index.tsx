import React, { memo } from "react";
import "./style.css";

export interface ConnectionDisplayProps {}

export const ConnectionDisplay: React.FC<ConnectionDisplayProps> = memo(({}) => {
  return <div className="ConnectionDisplay"></div>;
});
