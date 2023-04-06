import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { deleteUser, getUsers, updateUser } from './api';
import { Container } from 'react-bootstrap';
import './admin.css';

interface User {
    id: number;
    name: string;
    contact: string;
    email: string;
    total_cancelled: number;
    total_completed: number;
    total_earnings: number;
    total_cars: number;
}

interface AdminDashboardProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

function UserList(props: any, { setLoggedIn }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [refresh, setRefresh] = useState(true);
  const userType = location.pathname === '/admin/customers' ? 'Customers' : 'Owners';

  useEffect(() => {
    async function fetchUsers() {
        const user_type = props.userType;
        const id = '';
        const res = await getUsers(user_type, id) as User[]; // fetch list of users
        setUsers(res);
    } fetchUsers();
    setEditingUser(null);
  }, [props.userType, refresh]); // refresh upon userType change (and edit)

  const handleDeleteUser = async (user: User) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      const user_type = props.userType;
      const id = user.id;
      await deleteUser(id, user_type); // send DELETE request to API
      setUsers(users.filter(c => c.id !== user.id)); // remove user from state
    }
  };

  const handleEditUser = (user: User) => { // select user to be edited
    setEditingUser(user);
    setNewName(user.name);
    setNewContact(user.contact);
  };

  const handleConfirmEdit = async (user: User) => {
    const user_type = props.userType;
    const id = user.id;
    const data = {id, newContact, newName, user_type}
    const isConfirmed = window.confirm("Confirm changes?");
    if (isConfirmed) {
      await updateUser(data);
      setEditingUser(null); // deselect
      setRefresh(refresh ? false : true);
    }    
  };

  const handleClick = () => {
    setLoggedIn(false);
  };

  return (
    <Container className='userListContainer'>
      <Container className='adminNav'>
        <nav>
          <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className={`${props.userType === 'customer' ? 'selected-tab' : ''}`}>
            <Link className={`${props.userType === 'customer' ? 'no-cursor' : ''}`} to="/admin/customers">Customers</Link>
          </li>
          <li className={`${props.userType === 'owner' ? 'selected-tab' : ''}`}>
            <Link className={`${props.userType === 'owner' ? 'no-cursor' : ''}`} to="/admin/owners">Owners</Link>
          </li>
          <li>
            <Link to="/admin/cars">Cars</Link>
          </li>
          <li>
            <Link to="/admin" onClick={handleClick}>Logout</Link>
          </li>
          </ul>
        </nav>
      </Container>
      <Container className='userListArea'>
        <h2>User List: {userType}</h2>
        <table className='admin-table'>
            <thead>
                <tr className='admin-db-columns'>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  {props.userType === 'owner' && 
                  <th>Cars Owned</th>
                  }
                  <th>Cancelled Rentals</th>
                  <th>Completed Rentals</th>
                  {props.userType === 'owner' && 
                  <th>Total Earnings</th>
                  }
                  <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className={editingUser && editingUser.id === user.id ? 'admin-db-rows editing' : 'admin-db-rows'}>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                        <input type="text" size={10} value={newName} onChange={e => setNewName(e.target.value)} />
                    ) : (
                        user.name
                    )}
                  </td>
                  <td>
                    {editingUser && editingUser.id === user.id ? (
                        <input type="text" size={8} value={newContact} onChange={e => setNewContact(e.target.value)} />
                    ) : (
                        user.contact
                    )}
                  </td>
                  <td>{user.email}</td>
                  {props.userType === 'owner' && 
                  <td>{user.total_cars}</td>}
                  <td>{user.total_cancelled}</td>
                  <td>{user.total_completed}</td>
                  {props.userType === 'owner' && 
                  <td>{user.total_earnings}</td>}
                  <td className='adminActionButtons'>
                    {editingUser && editingUser.id === user.id ? (
                      <>
                      <button className="confirmButton" onClick={() => handleConfirmEdit(user)}>Confirm</button>
                      <button className="backButton" onClick={() => setEditingUser(null)}>Cancel</button>
                      </>
                      ) : (
                      <button className="editButton" onClick={() => handleEditUser(user)}>Edit</button>
                      )}
                      <button className="cancelButton" onClick={() => handleDeleteUser(user)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </Container>
    </Container>
  );
}

export default UserList;
