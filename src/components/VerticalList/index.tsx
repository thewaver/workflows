import React, { memo } from "react";
import "./style.css";

export interface VerticalListProps {
  title?: string;
  itemIds: string[];
  selectedItemId?: string;
  onAdd: () => void;
  onSelect: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  renderItem: (itemId: string) => JSX.Element;
}

export const VerticalList: React.FC<VerticalListProps> = memo(
  ({ title, itemIds, selectedItemId, onAdd, onSelect, onDelete, renderItem }) => {
    return (
      <div className="VerticalList">
        {title ? <div className="Title">{title}</div> : null}
        {itemIds.map((itemId) => {
          const isSelected = itemId === selectedItemId;
          const selectionCallback = () => onSelect(itemId);

          return (
            <div key={itemId} className={`Item ${isSelected ? "Selected" : ""}`}>
              <button
                className="FullWidth"
                onClick={selectionCallback}
                onMouseDown={selectionCallback}
                onMouseUp={selectionCallback}
              >
                {renderItem(itemId)}
              </button>
              <button className="Inverted Iconic Delete" onClick={() => onDelete(itemId)}>
                <i className="fas fa-times" />
              </button>
            </div>
          );
        })}
        <button className="Item Add" onClick={onAdd}>
          <i className="Icon fas fa-plus"></i>
          {"Add"}
        </button>
      </div>
    );
  },
);
