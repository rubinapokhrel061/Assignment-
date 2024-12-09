import React, { useState, useEffect } from "react";
import { FaPlus, FaUndo, FaRedo, FaSearch } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";

const Board = () => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", taskIds: [] },
    { id: "inProgress", title: "In Progress", taskIds: [] },
    { id: "done", title: "Done", taskIds: [] },
  ]);
  const [tasks, setTasks] = useState({});
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [taskInputVisible, setTaskInputVisible] = useState({});

  // Load saved data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("kanban-board");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setColumns(parsedData.columns);
      setTasks(parsedData.tasks);
    }
  }, []);

  // Save columns and tasks to local storage
  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify({ columns, tasks }));
  }, [columns, tasks]);

  const saveState = () => {
    setHistory((prevHistory) => [...prevHistory, { columns, tasks }]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setColumns(previousState.columns);
    setTasks(previousState.tasks);
    setHistory(history.slice(0, history.length - 1));
    setFuture([{ columns, tasks }, ...future]);
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    setColumns(nextState.columns);
    setTasks(nextState.tasks);
    setHistory([...history, { columns, tasks }]);
    setFuture(future.slice(1));
  };

  const addColumn = () => {
    const newColumn = { id: uuidv4(), title: "New Column", taskIds: [] };
    setColumns([...columns, newColumn]);
    saveState();
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setTasks((prevTasks) => {
      const remainingTasks = { ...prevTasks };
      Object.keys(prevTasks).forEach((taskId) => {
        if (prevTasks[taskId].columnId === columnId) {
          delete remainingTasks[taskId];
        }
      });
      return remainingTasks;
    });
    saveState();
  };

  const addTask = (columnId, taskContent) => {
    if (!taskContent) return;
    const newTask = {
      id: uuidv4(),
      content: taskContent,
      columnId,
    };
    setTasks((prevTasks) => ({ ...prevTasks, [newTask.id]: newTask }));
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, taskIds: [...col.taskIds, newTask.id] };
        }
        return col;
      })
    );
    saveState();
    setNewTaskContent("");
    setTaskInputVisible((prev) => ({ ...prev, [columnId]: false }));
  };

  const deleteTask = (taskId, columnId) => {
    setTasks((prevTasks) => {
      const remainingTasks = { ...prevTasks };
      delete remainingTasks[taskId];
      return remainingTasks;
    });
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
        }
        return col;
      })
    );
    saveState();
  };

  const editTask = (taskId, newContent) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskId]: { ...prevTasks[taskId], content: newContent },
    }));
    saveState();
  };

  const moveTask = (taskId, fromColumnId, toColumnId) => {
    setColumns(
      columns.map((column) => {
        if (column.id === fromColumnId) {
          column.taskIds = column.taskIds.filter((id) => id !== taskId);
        }
        if (column.id === toColumnId) {
          column.taskIds.push(taskId);
        }
        return column;
      })
    );
    setTasks((prevTasks) => {
      const task = prevTasks[taskId];
      return {
        ...prevTasks,
        [taskId]: { ...task, columnId: toColumnId },
      };
    });
    saveState();
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, title: newTitle } : column
      )
    );
    saveState();
  };

  const filteredTasks = Object.values(tasks).filter((task) =>
    task.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg shadow-xl">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white p-2 rounded-full shadow-md max-w-xs">
              <input
                type="text"
                placeholder="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-700 placeholder-gray-400 focus:outline-none p-2 rounded-full"
              />
              <FaSearch className="text-gray-500" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={addColumn}
              className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <FaPlus className="mr-2" /> Add Column
            </button>
            <button
              onClick={undo}
              className="flex items-center bg-green-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
            >
              <FaUndo className="mr-2" /> Undo
            </button>
            <button
              onClick={redo}
              className="flex items-center bg-yellow-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-yellow-700 transition duration-300"
            >
              <FaRedo className="mr-2" /> Redo
            </button>
          </div>
        </div>

        <div className="flex gap-6 justify-around flex-wrap">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              moveTask={moveTask}
              searchQuery={searchQuery}
              deleteColumn={deleteColumn}
              addTask={addTask}
              taskInputVisible={taskInputVisible}
              setTaskInputVisible={setTaskInputVisible}
              newTaskContent={newTaskContent}
              setNewTaskContent={setNewTaskContent}
              editTask={editTask}
              deleteTask={deleteTask}
              updateColumnTitle={updateColumnTitle}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;
