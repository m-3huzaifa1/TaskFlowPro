import { useEffect, useState } from 'react';
import api from '@/utils/api';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import ProtectedRoute from '../components/ProtectedRoute';
import PersistLogin from '@/utils/PersistLogin';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import NotificationBadge from '@/components/NotificationBadge';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const [filter, setFilter] = useState('all');
  const [filters, setFilters] = useState({
    type: 'all',
    status: '',
    priority: '',
    dueDate: '',
    search: ''
  });
  const [taskTab, setTaskTab] = useState(false)
  const { logout, user } = useAuth();
  const token = user?.accessToken
  const userId = user?.foundUser?._id
  const userRole = user?.foundUser?.role
  // console.log(user)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams({
          filter: filters.type,
          status: filters.status,
          priority: filters.priority,
          dueDate: filters.dueDate,
          search: filters.search
        }).toString();
        console.log(userId)
        const res = await api.post(`/api/tasks?${params}`, { userId: userId });
        setTasks(res?.data);
        console.log(res?.data)
      }
      catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/login';
        } else {
          alert(err.response?.data?.error);
        }
        console.log(err?.response?.data)
      }
    };
    fetchTasks();
  }, [filters, userId]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
  };

  const handleDeleteTask = (deletedTaskId) => {
    setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
  };

  return (
    <PersistLogin>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Bar */}
          <nav className="bg-white z-50 w-full shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <span className="text-xl font-bold text-gray-900">TaskFlow<span className="text-blue-600">Pro</span></span>
                </div>

                {/* Desktop Menu - Increased text size */}
                <div className="hidden md:flex my-auto space-x-8">
                  {userRole === 'Admin' && (
                    <Link href="/admin/users" className="my-auto text-blue-900 no-underline hover:text-sky-600 text-xl font-semibold">
                      Manage Users
                    </Link>
                  )}
                  {(userRole === 'Admin' || userRole === 'Manager') && (
                    <Link href="/auditLogs" className="my-auto text-blue-900 no-underline hover:text-sky-600 text-xl font-semibold">
                      Audit Logs
                    </Link>
                  )}
                  {(userRole === 'Admin' || userRole === 'Manager') && (
                    <Link href="/analytics" className="my-auto text-blue-900 no-underline hover:text-sky-600 text-xl font-semibold">
                      Task Analytics
                    </Link>
                  )}
                  <NotificationBadge />
                  <button
                    onClick={logout}
                    className="flex cursor-pointer rounded-3xl bg-blue-800 items-center space-x-2 my-auto text-white px-3 py-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-small">Logout</span>
                  </button>
                </div>
                <div className='md:hidden flex justify-center my-auto space-x-2'>
                <div className='md:hidden my-auto'>
                <NotificationBadge/>
                </div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-3 rounded-lg text-blue-900 hover:bg-sky-50"
                >
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
                </div>
                
                {isMenuOpen && (
                  <div className="md:hidden my-auto py-auto bg-white px-4 pt-2 z-200 pb-4 space-y-2">
                    {userRole === 'Admin' && (
                      <Link href="/admin/users" className="block px-4 py-3 text-lg text-blue-900 no-underline hover:bg-sky-50 rounded-xl">
                        Manage Users
                      </Link>
                    )}
                    {(userRole === 'Admin' || userRole === 'Manager') && (
                      <Link href="/analytics" className="block px-4 py-3 text-lg text-blue-900 no-underline hover:bg-sky-50 rounded-xl">
                        Audit Logs
                      </Link>
                    )}
                    {(userRole === 'Admin' || userRole === 'Manager') && (
                      <Link href="/auditLogs" className="block px-4 py-3 text-lg text-blue-900 no-underline hover:bg-sky-50 rounded-xl">
                        Task Analytics
                      </Link>
                    )}
                    
                  <button
                    onClick={logout}
                    className="flex cursor-pointer rounded-3xl bg-blue-800 items-center space-x-2 my-auto text-white px-3 py-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-small">Logout</span>
                  </button>
                  </div>
                )}
                {/* <div className='flex justify-center gap-2 my-auto'>


                  
                </div> */}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl text-center mb-5 font-bold text-gray-900">Task Management</h1>
            <div className="items-center mb-8">
              <div className='flex justify-center mb-10'>
                <div className='bg-white p-1 rounded-full shadow-sm'>
                  <button
                    onClick={() => setTaskTab(true)}
                    className={`cursor-pointer rounded-full px-6 py-2 mx-1 transition-colors ${taskTab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setTaskTab(false)}
                    className={`cursor-pointer rounded-full px-6 py-2 mx-1 transition-colors ${!taskTab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            </div>

            {taskTab ? (
              <div className='flex justify-center'>
                <TaskForm />
              </div>
            ) : (
              <div className='mx-auto'>
                {/* <div className="my-6 flex justify-center">
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Tasks</option>
                    <option value="my">My Tasks</option>
                    <option value="created">Created Tasks</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div> */}
                <div className="mb-8 space-y-4">
                  <div className="flex justify-center">
                    <input
                      type="text"
                      placeholder="Search tasks by Title or Description..."
                      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <svg className="my-auto mx-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="all">All Tasks</option>
                      <option value="my">Assigned to Me</option>
                      <option value="created">Created by Me</option>
                      <option value="overdue">Overdue</option>
                    </select>

                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>

                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>

                    <input
                      type="date"
                      value={filters.dueDate}
                      onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks?.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className="max-w-7xl w-1/2 items-center mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="items-center mb-8">
          <h1 className="text-3xl text-center mb-10 font-bold text-gray-900">Task Dashboard</h1>
        <div className=''>
          <div className='flex justify-center'>
          <button onClick={()=>setTaskTab(true)} className={`cursor-pointer rounded-3xl ${taskTab ? 'text-white bg-blue-600' : 'bg-white text-blue-600'} px-3 py-2 mx-1`}>
            Create Task
          </button>
          <button onClick={()=>setTaskTab(false)} className={`cursor-pointer rounded-3xl ${!taskTab ? 'text-white bg-blue-600' : 'bg-white text-blue-600'} px-3 py-2 mx-1`}>
            Check Tasks
          </button>
          </div>
        </div>
      </div>
      {taskTab ? (
      <div >
      <TaskForm />
      </div> 
      ) : (
      <div className='items-center mx-auto'>

      <div className="my-6 flex justify-center">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Tasks</option>
              <option value="my">My Tasks</option>
              <option value="created">Created Tasks</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
        </div>
      </div>)}
    </div> */}
      </ProtectedRoute>
    </PersistLogin>
  );
};

export default Dashboard;