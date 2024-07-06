import React, { useState, type FormEvent } from "react";
import IconPencil from "../icons/IconPencil";
import IconCancel from "../icons/IconCancel";
import IconApply from "../icons/IconApply";

export const EditableText = ({
  initialText,
  onUpdate,
}: {
  initialText: string;
  onUpdate: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [editedText, setEditedText] = useState(initialText);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault
    setText(editedText);
    onUpdate(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="text-green-500 hover:text-green-700"
          >
            <IconApply />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-red-500 hover:text-red-700"
          >
            <IconCancel />
          </button>
        </form>
      ) : (
        <>
          <span>{text}</span>
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700"
          >
            <IconPencil />
          </button>
        </>
      )}
    </div>
  );
};
