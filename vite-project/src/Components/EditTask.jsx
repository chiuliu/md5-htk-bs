import React, { useState } from 'react';

const EditTask = ({ task, onSave, onCancel }) => {
    const [title, setTitle] = useState(task.title);
    const [startTime, setStartTime] = useState(task.startTime);
    const [deadlineTime, setDeadlineTime] = useState(task.deadlineTime);

    const handleSave = () => {
        if (!title || new Date(startTime) >= new Date(deadlineTime)) {
            alert('Thông tin không hợp lệ!');
            return;
        }
        onSave({ ...task, title, startTime, deadlineTime });
    };

    return (
        <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-4">Sửa Công Việc</h2>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Tên công việc"
                className="border p-2 rounded w-full mb-2"
            />
            <input
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <input
                type="datetime-local"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-between">
                <button onClick={handleSave} className="bg-blue-600 text-white py-2 px-4 rounded">Lưu</button>
                <button onClick={onCancel} className="bg-gray-300 py-2 px-4 rounded">Hủy</button>
            </div>
        </div>
    );
};

export default EditTask;