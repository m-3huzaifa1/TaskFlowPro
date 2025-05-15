import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProtectedRoute from '../components/ProtectedRoute';
import PersistLogin from '@/utils/PersistLogin';
import { useAuth } from '@/context/AuthContext';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user }  = useAuth()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.post('/api/audit-logs');
        setLogs(response?.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load audit logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const getActionColor = (action) => {
    const colors = {
      TASK_CREATED: 'bg-[#BBF7D0]',
      TASK_UPDATED: 'bg-[#BFDBFE]',
      TASK_DELETED: 'bg-[#FECACA]',
      TASK_ASSIGNED:'bg-[#FDE68A]'
    };
    return colors[action] || 'bg-gray-200';
  };
  console.log(logs)
  return (
    <PersistLogin>
      <ProtectedRoute>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

          {loading ? (
            <div>Loading audit logs...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Task</th>
                    <th className="px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {log.userId?.name || 'N/A'} ({log.userId?.email || 'N/A'})
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded ${getActionColor(log.action)}`}>
                          {log.action.toLowerCase().replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-2">
                        {log.details?.title || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ProtectedRoute>
    </PersistLogin>
  );
};

export default AuditLogs;