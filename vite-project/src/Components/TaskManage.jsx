import React from "react";
import { FaCheck, FaTrashAlt, FaEdit } from "react-icons/fa";
import EditTask from "./EditTask.jsx"; // Import component EditTask

class TaskManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: JSON.parse(localStorage.getItem("tasks")) || [],
      title: "",
      startTime: "",
      deadlineTime: "",
      activeTab: "ongoing",
      editingTask: null,
      nextId: this.getNextId(), // ID tự tăng cho công việc mới
    };
  }

  // Hàm để lấy ID tiếp theo từ localStorage
  getNextId() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  }

  // Hàm thêm công việc mới
  addTask = () => {
    const { title, startTime, deadlineTime, tasks, nextId } = this.state;
    const now = new Date();
    const start = new Date(startTime);
    const deadline = new Date(deadlineTime);

    // Validate
    if (!title || start < now || deadline <= start) {
      alert("Thông tin không hợp lệ!");
      return;
    }

    // Tạo công việc mới với ID tự tăng
    const newTask = {
      id: nextId,
      title,
      startTime,
      deadlineTime,
      isDone: false,
    };
    const updatedTasks = [...tasks, newTask];

    this.setState({ tasks: updatedTasks, nextId: nextId + 1 }); // Cập nhật ID tiếp theo
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    this.clearInputs();
  };

  clearInputs = () => {
    this.setState({ title: "", startTime: "", deadlineTime: "" });
  };

  // Hoàn thành công việc
  completeTask = (id) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isDone: true } : task
    );
    this.setState({ tasks: updatedTasks });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Xóa công việc theo ID
  deleteTask = (id) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.filter((task) => task.id !== id);
    this.setState({ tasks: updatedTasks });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Chỉnh sửa công việc
  startEditing = (task) => {
    this.setState({ editingTask: task });
  };

  saveTask = (updatedTask) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.setState({ tasks: updatedTasks, editingTask: null });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  cancelEdit = () => {
    this.setState({ editingTask: null });
  };

  // Render danh sách công việc
  renderTasks = () => {
    const { tasks, activeTab } = this.state;
    return tasks
      .filter((task) => (activeTab === "ongoing" ? !task.isDone : task.isDone))
      .map((task) => (
        <li
          key={task.id} // Sử dụng ID làm key
          className={`flex justify-between items-center p-4 mb-2 rounded-lg ${
            new Date(task.deadlineTime) - new Date() < 12 * 60 * 60 * 1000
              ? "bg-red-300"
              : "bg-gray-200"
          }`}
        >
          <div>
            <strong>{task.title}</strong>
            <br />
            <span className="text-sm text-gray-600">
              Bắt đầu: {task.startTime}
            </span>
            <br />
            <span className="text-sm text-gray-600">
              Kết thúc: {task.deadlineTime}
            </span>
          </div>
          <div className="flex">
            <button
              onClick={() => this.completeTask(task.id)} // Hoàn thành công việc theo ID
              className="text-green-600 hover:text-green-800"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => this.startEditing(task)} // Bắt đầu chỉnh sửa công việc
              className="text-blue-600 hover:text-blue-800 ml-2"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => this.deleteTask(task.id)} // Xóa công việc theo ID
              className="text-red-600 hover:text-red-800 ml-2"
            >
              <FaTrashAlt />
            </button>
          </div>
        </li>
      ));
  };

  render() {
    const { editingTask } = this.state;

    return (
      <div className="mt-4">
        {editingTask ? (
          <EditTask
            task={editingTask}
            onSave={this.saveTask}
            onCancel={this.cancelEdit}
          />
        ) : (
          <>
            <div className="flex justify-around mb-4">
              <button
                onClick={() => this.setState({ activeTab: "ongoing" })}
                className={`py-2 px-4 rounded ${
                  this.state.activeTab === "ongoing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Đang diễn ra
              </button>
              <button
                onClick={() => this.setState({ activeTab: "completed" })}
                className={`py-2 px-4 rounded ${
                  this.state.activeTab === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Đã hoàn thành
              </button>
            </div>

            <div className="tab-content">
              <h2 className="text-xl font-semibold mb-2">
                {this.state.activeTab === "ongoing"
                  ? "Công việc đang diễn ra"
                  : "Công việc đã hoàn thành"}
              </h2>
              <ul>{this.renderTasks()}</ul>
            </div>

            <h3 className="text-lg font-semibold mt-4">Thêm công việc mới</h3>
            <input
              type="text"
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
              placeholder="Tên công việc"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              type="datetime-local"
              value={this.state.startTime}
              onChange={(e) => this.setState({ startTime: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              type="datetime-local"
              value={this.state.deadlineTime}
              onChange={(e) => this.setState({ deadlineTime: e.target.value })}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <button
              onClick={this.addTask}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Thêm công việc
            </button>
          </>
        )}
      </div>
    );
  }
}

export default TaskManager; // Xuất component TaskManager
