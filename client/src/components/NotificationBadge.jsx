import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import api from '@/utils/api';
import { io } from 'socket.io-client';

const NotificationBadge = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const loadNotifications = async () => {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    try {

      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        withCredentials: true
      });
      console.log(socket)
      if (user?.foundUser?._id) {
        socket.emit('join-room', user?.foundUser?._id);
      }

   
      loadNotifications();

      // const playSound = () => {
      //   const audio = new Audio('/notification.mp3');
      //   audio.play();
      // };

      socket.on('taskAssigned', (message) => {
        console.log(message)
        setNotifications(prev => [{
          Time: Date.now(),
          title: `New Task Assigned: ${message.title}`,
          details: `Due: ${new Date(message.dueDate).toLocaleDateString()}`,
          read: false
        }, ...prev]);

        // playSound();
      });

      return () => socket.disconnect();
    }
    catch (err) {
      console.log(err)
    }


  }, [user]);

  const dismissNotification = async (id) => {
    try {
      const res = await api.post(`/api/notifications/${id}/read`);
      console.log(res?.data)
      setNotifications(prev => prev.filter(n => n.userId !== id));
      loadNotifications();
    }
    catch (err) {
      console.log(err)
    }
  };

  const markAllRead = async () => {
    try {
      const res = await api.post(`/api/notifications/read`);
      console.log(res?.data)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      loadNotifications();
    }
    catch (err) {
      console.log(err)
    }

  };
  console.log(notifications)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 relative"
      >
        <BellIcon className="cursor-pointer h-6 w-6" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={markAllRead}
              className="text-blue-600 cursor-pointer text-sm hover:text-blue-700"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No new notifications
              </div>
            ) : (
              notifications?.map((notification) => {
                let date = (notification?.relatedTask?.dueDate || notification?.dueDate)

                return (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-blue-900">{notification?.message}</p>
                        {/* <p className="text-sm text-blue-500 mt-1">Due Date: {date?.split('T')[0]}</p> */}
                      </div>
                      <button
                        onClick={() => dismissNotification(notification._id)}
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;