import React from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import Task from "./Task";
import { useDrop } from "react-dnd";

const Column = ({
  column,
  tasks,
  moveTask,
  searchQuery,
  deleteColumn,
  addTask,
  taskInputVisible,
  setTaskInputVisible,
  newTaskContent,
  setNewTaskContent,
  editTask,
  deleteTask,
  updateColumnTitle,
}) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      if (item.columnId !== column.id) {
        moveTask(item.id, item.columnId, column.id);
      }
    },
  });

  return (
    <div
      ref={drop}
      className="bg-gray-200 p-4 rounded-lg w-full md:w-[40%] lg:w-[30%] shadow-md"
    >
      <div className="flex justify-between gap-2 mb-2">
        <input
          type="text"
          value={column.title}
          onChange={(e) => updateColumnTitle(column.id, e.target.value)} // Call updateColumnTitle function
          className="text-lg p-2 rounded-md font-semibold border-none bg-transparent w-full"
        />
        <button
          onClick={() => deleteColumn(column.id)}
          className="text-red-500"
        >
          <FaTrashAlt />
        </button>
      </div>

      <div>
        {Object.values(tasks)
          .filter(
            (task) =>
              task.columnId === column.id &&
              task.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              index={task.id}
              deleteTask={deleteTask}
              editTask={editTask}
              columnId={column.id}
              moveTask={moveTask}
            />
          ))}
      </div>

      {taskInputVisible[column.id] && (
        <div className="mt-4 flex gap-2 justify-center items-center">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            className="border p-2 rounded-md w-full"
            placeholder="Add new task"
          />
          <button
            onClick={() => addTask(column.id, newTaskContent)}
            className="bg-green-500 text-white p-2 py-3 rounded"
          >
            <FaPlus />
          </button>
        </div>
      )}

      {!taskInputVisible[column.id] && (
        <button
          onClick={() =>
            setTaskInputVisible((prev) => ({ ...prev, [column.id]: true }))
          }
          className="bg-green-500 text-white p-2 rounded mt-4 w-full"
        >
          Add Task
        </button>
      )}
    </div>
  );
};

export default Column;
