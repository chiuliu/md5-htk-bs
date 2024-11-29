import React from "react";
import TaskManage from "./Components/TaskManage";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Quản lý Công việc</h1>
      <TaskManage />
    </div>
  );
};

export default App;
