import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUser, getUsers, updateUser } from './api';

interface User {
    id: number;
    name: string;
    contact: string;
    email: string;
    total_cancelled: number;
    total_completed: number;
}

function UserList(props: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');

  useEffect(() => {
    async function fetchUsers() {
        const user_type = props.userType;
        const res = await getUsers(user_type) as User[]; // fetch list of users
        setUsers(res);
    }
    if (!editingUser) { // if editingUser is null
      fetchUsers();
    } 
  }, [props.userType, editingUser]); // refresh upon userType change (and edit)

  const handleDeleteUser = async (user: User) => {
    const user_type = props.userType;
    const id = user.id;
    await deleteUser(id, user_type); // send DELETE request to API
    setUsers(users.filter(c => c.id !== user.id)); // remove user from state
  };

  const handleEditUser = (user: User) => { // select user to be edited
    setEditingUser(user);
    setNewName(user.name);
    setNewContact(user.contact);
  };

  const handleConfirmEdit = async (user: User) => {
    const user_type = props.userType;
    const id = user.id;
    /*const updatedUser = {
      ...user,
      name: newName,
      contact: newContact,
    };*/
    const data = {id, newContact, newName, user_type}
    await updateUser(data);
        // TODO: Send PUT request to API to update user info
    setEditingUser(null); // deselect
  };

  return (
    <div>
      <nav>
        <ul>
        <li>
          <Link to="/">Sign out</Link>
        </li>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/customers">Customers</Link>
        </li>
        <li>
          <Link to="/admin/owners">Owners</Link>
        </li>
        <li>
          <Link to="/admin/cars">Cars</Link>
        </li>
        </ul>
      </nav>
      <h2>User List</h2>
      <table>
          <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Cancelled Rentals</th>
                <th>Completed Rentals</th>
                <th>Action</th>
              </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                      <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />
                  ) : (
                      user.name
                  )}
                </td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                      <input type="text" value={newContact} onChange={e => setNewContact(e.target.value)} />
                  ) : (
                      user.contact
                  )}
                </td>
                <td>{user.email}</td>
                <td>{user.total_cancelled}</td>
                <td>{user.total_completed}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <>
                    <button onClick={() => handleConfirmEdit(user)}>Confirm</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </>
                    ) : (
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    )}
                    <button onClick={() => handleDeleteUser(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
}

export default UserList;
