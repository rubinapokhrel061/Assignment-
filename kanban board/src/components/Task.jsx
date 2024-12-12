import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDrag } from "react-dnd";

const Task = ({ task, deleteTask, editTask, columnId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);

  // Drag logic
  const [, drag] = useDrag({
    type: "task",
    item: { id: task.id, columnId },
  });

  // Handle task edit start
  const handleEditStart = () => {
    setIsEditing(true);
  };

  // Handle task content change
  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  // Save the edited task
  const handleSave = () => {
    editTask(task.id, editedContent);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(task.content);
  };

  return (
    <div
      ref={drag}
      className="bg-white p-4 rounded-lg shadow-md mb-4"
      style={{ cursor: "move" }}
    >
      <div className="flex justify-between">
        {isEditing ? (
          <div className="">
            <input
              type="text"
              value={editedContent}
              onChange={handleChange}
              className="flex-1 border p-2 rounded-md"
            />
            <div className="pt-1 flex gap-4">
              <button onClick={handleSave} className="text-green-500 ml-2">
                <FaEdit />
              </button>
              <button onClick={handleCancel} className="text-red-500 ml-2">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 gap-2 justify-between">
            <p className="">{task.content}</p>
            <div className="flex items-center space-x-2">
              <button onClick={handleEditStart} className="text-green-500">
                <FaEdit />
              </button>
              <button
                onClick={() => deleteTask(task.id, columnId)}
                className="text-red-500"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
