import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '@/utils/api';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [selectedAssignee, setSelectedAssignee] = useState(task.assignedTo?._id);
  const userRole = user?.foundUser?.role
  // console.log(task,user)
  useEffect(() => {
    // Fetch users for assignment
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users', {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${user?.accessToken}`,
          },
        });
        setUsers(response?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await api.put(`/api/tasks/${task._id}`, {
        status: newStatus,
        userId: user?.foundUser?._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user?.accessToken}`,
        },
      });
      onUpdate(updatedTask?.data);
      setSelectedStatus(newStatus);
      window.location.reload()

    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAssignee) return;
    try {
      const response = await api.put(`/api/tasks/${task._id}/assign`, {
        assignedTo: selectedAssignee
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user?.accessToken}`,
        },
      });
      onUpdate(response.data);
      setIsAssigning(false);
      window.location.reload()
    } catch (error) {
      console.error('Assignment failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.post(`/api/tasks/${task._id}`,{
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user?.accessToken}`,
        },
      });
      if (onDelete) {
        onDelete(task._id);
      }
      window.location.reload()
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Delete failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const priorityColors = {
    High: 'red',
    Medium: 'yellow',
    Low: 'green'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          {task.assignedTo && (
            <p className="text-sm text-gray-500 mt-1">
              Assigned to: {task.assignedTo.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 text-xs rounded-full 
              ${task.status === 'Done' ? 'bg-green-100 text-green-800' :
                task.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}`}>
              {task.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full 
              ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'}`}>
              {task.priority}
            </span>
          </div>
        {/* <span className={`px-2 py-1 text-sm rounded-full bg-${priorityColors[task.priority]}-100 text-${priorityColors[task.priority]}-800`}>
          {task.priority}
        </span> */}
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2 cursor-pointer py-1 border rounded-md text-sm"
          >
            <option value="Todo" className='cursor-pointer'>Todo</option>
            <option value="InProgress" className='cursor-pointer'>In Progress</option>
            <option value="Done" className='cursor-pointer'>Done</option>
          </select>
        </div>

        {!isAssigning ? ( (user?.foundUser?._id === task.createdBy._id || userRole === 'Admin' || userRole === 'Manager') &&
          <button
            onClick={() => setIsAssigning(true)}
            className="text-blue-600 cursor-pointer hover:text-blue-700 text-sm font-medium"
          >
            Assign to someone
          </button>
        ) : (
          <div className="flex gap-2">
            <select
              value={selectedAssignee || ''}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="flex-1 px-2 py-1 cursor-pointer border rounded-md text-sm"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              className="px-2 py-1 cursor-pointer bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
        {(user?.foundUser?._id === task.createdBy._id || userRole === "Admin") && (
          <button
            onClick={handleDelete}
            className="text-red-600 cursor-pointer hover:text-red-700 font-medium flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
