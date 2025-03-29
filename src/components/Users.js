// src/pages/Users.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Stylesheet/Users.css'
import { Modal } from 'bootstrap';
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (alert.message) {
      const timeout = setTimeout(() => setAlert({ message: '', type: '' }), 1500);
      return () => clearTimeout(timeout);
    }
  }, [alert]);
  const fetchUsers = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://reqres.in/api/users?page=${pageNum}`);
      setUsers(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      setMessage('Failed to fetch users');
      setVariant('danger');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);
  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, form);
      setAlert({ type: 'success', message: 'User updated successfully!' });
  
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...form } : user
      );
      setUsers(updatedUsers);
  
      const modal = Modal.getOrCreateInstance(document.getElementById('editModal'));
      modal.hide();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to update user.' });
    }
  };
   
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email });
   ;
   const modalElement = document.getElementById('editModal');
const modal = Modal.getOrCreateInstance(modalElement);
modal.show();
  };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://reqres.in/api/users/${id}`);
//       setUsers(users.filter(user => user.id !== id));
//       setMessage('User deleted successfully!');
//       setVariant('success');
//     } catch (error) {
//       setMessage('Error deleting user.');
//       setVariant('danger');
//     }
//   };
const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setAlert({ type: 'success', message: 'User deleted successfully!' });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete user.' });
    }
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, form);
      const updated = users.map(user =>
        user.id === selectedUser.id ? { ...user, ...form } : user
      );
      setUsers(updated);
      setMessage('User updated successfully!');
      setVariant('success');
      document.getElementById('closeModal').click();
    } catch (error) {
      setMessage('Error updating user.');
      setVariant('danger');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">User List</h2>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by name or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
      {alert.message && (
  <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
    {alert.message}
    <button type="button" className="btn-close" onClick={() => setAlert({ message: '', type: '' })}></button>
  </div>
)}

      {message && <div className={`alert alert-${variant}`}>{message}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Avatar</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <img src={user.avatar} alt="avatar" className="rounded-circle" width="50" height="50" />
                  </td>
                  <td>{user.first_name} </td>
                  <td>{user.last_name}</td>
                  {/* <td>{user.email}</td> */}
                  <td>
                    <button className="btn btn-sm edit_Btn me-2" onClick={() => handleEditClick(user)}
                        data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                    <MdOutlineModeEdit />
                    </button>
                    <button className="btn btn-sm del_Btn" onClick={() => handleDelete(user.id)}
                        data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                    <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
  <tr>
    <td colSpan="4" className="text-center text-muted">
      No users found.
    </td>
  </tr>
)}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx} className={`page-item ${page === idx + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(idx + 1)}>{idx + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleUpdate}>
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" id="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Update</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;
