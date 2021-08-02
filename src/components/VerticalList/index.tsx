import React, { KeyboardEvent, memo, useCallback } from "react";
import "./style.css";

export interface VerticalListProps {
  title?: string;
  itemIds: string[];
  selectedItemId?: string;
  itemKeyPrefix?: string;
  onAdd: () => void;
  onSelect: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  renderItem: (itemId: string) => JSX.Element;
}

export const VerticalList: React.FC<VerticalListProps> = memo(
  ({ title, itemIds, selectedItemId, itemKeyPrefix, onAdd, onSelect, onDelete, renderItem }) => {
    const handleKeyDown = useCallback(
      (itemId: string, e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.keyCode === 46) {
          e.preventDefault();
          onDelete(itemId);
        }
      },
      [onDelete],
    );

    return (
      <div className="VerticalList">
        {title ? <div className="Title">{title}</div> : null}
        {itemIds.map((itemId) => {
          const isSelected = itemId === selectedItemId;
          const selectionCallback = () => onSelect(itemId);

          return (
            <div
              key={itemId}
              id={`${itemKeyPrefix}_${itemId}`}
              className={`Item ${isSelected ? "Selected" : ""}`}
            >
              <button
                className="FullWidth"
                onClick={selectionCallback}
                onMouseDown={selectionCallback}
                onMouseUp={selectionCallback}
                onKeyDown={(e) => handleKeyDown(itemId, e)}
              >
                {renderItem(itemId)}
              </button>
              <button className="Inverted Iconic Delete" onClick={() => onDelete(itemId)}>
                <i className="fas fa-times" />
              </button>
            </div>
          );
        })}
        <button className="Item Primary Add" onClick={onAdd}>
          <i className="Icon fas fa-plus"></i>
          {"Add"}
        </button>
      </div>
    );
  },
);
