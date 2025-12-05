import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://taxibackend-git-main-bmkl-basnayakes-projects.vercel.app/api/users"; 

const getAdminToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || localStorage.getItem("authToken");
};

const UserTablePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");

    const token = getAdminToken();
    if (!token) {
      setErrorMsg(" No admin token found. Please log in as admin.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setErrorMsg(" Unauthorized. Token may be invalid or expired.");
      } else if (err.response?.status === 403) {
        setErrorMsg(" Forbidden. You do not have admin access.");
      } else {
        setErrorMsg(" Failed to fetch users. Check server.");
      }

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-6">Loading users...</p>;
  if (errorMsg)
    return (
      <div className="text-center mt-6">
        <p className="text-red-500 mb-4">{errorMsg}</p>
        <button
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-2">PASSANGER ENROLLMENT HISTORY</h1>
    

      {users.length === 0 ? (
        <p className="text-gray-500 mt-6">No users found.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-500">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Registered At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const userId = `U${String(index + 1).padStart(3, "0")}`;
                const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";
                return (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">{userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.mobile || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{regDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTablePage;