import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import PersistLogin from '@/utils/PersistLogin';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UserManagement() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('User');
    const userRole = user?.foundUser?.role
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        // if (userRole === 'Admin') {
        fetchUsers();
        // }
    }, [user]);

    const handleRoleUpdate = async (userId) => {
        try {
            await api.put(`/api/users/${userId}/role`, { role: selectedRole });
            setUsers(users.map(u =>
                u._id === userId ? { ...u, role: selectedRole } : u
            ));
        } catch (error) {
            console.error('Role update failed:', error);
        }
    };

    if (userRole !== 'Admin') {
        return <div>You don't have permission to view this page</div>;
    }

    return (
        <PersistLogin>
            <ProtectedRoute>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">User Management</h1>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Current Role</th>
                                <th className="px-4 py-2">New Role</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="border  cursor-pointer rounded p-1"
                                        >
                                            <option value="User">User</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleRoleUpdate(user._id)}
                                            className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ProtectedRoute>
        </PersistLogin>
    );
}