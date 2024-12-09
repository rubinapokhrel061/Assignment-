import React from "react";
import Board from "./components/Board";

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-screen-xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-12">
          Kanban Board
        </h1>
        <Board />
      </div>
    </div>
  );
};

export default App;
