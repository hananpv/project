import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }
};

  // BLOCK / UNBLOCK
 const toggleBlock = async (user) => {
  try {
    const isBlocked = !user.isBlocked;

    await api.patch(`/users/${user.id}`, { isBlocked });

    setUsers(prev =>
      prev.map(u =>
        u.id === user.id ? { ...u, isBlocked } : u
      )
    );
  } catch {
    alert("Action failed");
  }
};

  // CHANGE TIER
  const changeTier = async (user, tier) => {
    try {
      await api.patch(`/users/${user.id}`, { tier });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, tier } : u
        )
      );
    } catch (error) {
      console.error(error);
      alert("Tier update failed");
    }
  };

  return (
    <div className="users">
      <h2>Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>

                  {/* Tier */}
                  <td>
                    <select
                      value={u.tier || "Bronze"}
                      onChange={(e) =>
                        changeTier(u, e.target.value)
                      }
                    >
                      <option>Bronze</option>
                      <option>Gold</option>
                      <option>Diamond</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td>
                    {u.isBlocked ? (
                      <span className="blocked">Blocked</span>
                    ) : (
                      <span className="active">Active</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <button onClick={() => setViewUser(u)}>
                      View
                    </button>

                    <button onClick={() => toggleBlock(u)}>
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button onClick={() => deleteUser(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/*  VIEW MODAL  */}
      {viewUser && (
        <div className="modal" onClick={() => setViewUser(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>User Details</h3>

            <p><strong>ID:</strong> {viewUser.id}</p>
            <p><strong>Username:</strong> {viewUser.username}</p>
            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Password:</strong> {viewUser.password}</p>
            <p><strong>Tier:</strong> {viewUser.tier || "Bronze"}</p>
         
            <div className="modal-actions">
              <button onClick={() => setViewUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;