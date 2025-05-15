import { useState } from 'react';
import api from '@/utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '@/context/AuthContext';

const TaskForm = () => {
  const { user } = useAuth()
  const token = user?.accessToken
  const User = user?.foundUser
  // console.log(user)
  const [taskData, setTaskData] = useState({
    title: null,
    description: null,
    dueDate: new Date(),
    priority: 'Medium',
    createdBy: User?._id
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tasks/create', taskData,{
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });
      alert('Task Created Succesfully!')
      window.location.reload();
    } catch (error) {
      console.error('Task creation failed:', error);
      alert('Failed to create task. Please try again.');
    }
  };
  const checkSubmit = taskData?.title && taskData?.description 
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter task title"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Add task description"
          rows="3"
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <DatePicker
            selected={taskData.dueDate}
            onChange={(date) => setTaskData({ ...taskData, dueDate: date })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            minDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={taskData.priority}
            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!checkSubmit}
        className={`w-full ${checkSubmit ? 'bg-blue-600 cursor-pointer hover:bg-blue-700' : 'bg-blue-400'}  text-white py-2 px-4 rounded-lg font-medium transition-colors`}
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;