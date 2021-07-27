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

          return (
            <button
              key={itemId}
              className={`Item ${isSelected ? "Selected" : ""}`}
              onClick={() => onSelect(itemId)}
            >
              {renderItem(itemId)}
              <button className="Inverted Iconic Delete" onClick={() => onDelete(itemId)}>
                <i className="fas fa-times" />
              </button>
            </button>
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
