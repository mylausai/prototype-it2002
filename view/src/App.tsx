import './App.scss'
import React from 'react'
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import LoginPage from './LoginPage'
import SearchCar from './SearchCar'
import HomePage from './HomePage'
import PostCar from './PostCar'
import OrderHistory from './OrderHistory'
import AdminDashboard from './AdminDashboard'
import UserList from './UserList'
import CarList from './CarList'
import AdminLogin from './AdminLogin'
import { ChakraProvider } from '@chakra-ui/react'

interface PrivateAdminRouteProps {
  element: JSX.Element;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const PrivateAdminRoute = ({ element }: PrivateAdminRouteProps) => {
    return loggedIn ? (
      element
    ) : (
      <Navigate to="/admin" replace />
    );
  };

  return (
    <ChakraProvider>
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}>
        </Route>
        <Route path="/login/customer" element={<LoginPage userType="customer"/>}>
        </Route>
        <Route path="/login/owner" element={<LoginPage userType="owner"/>}>
        </Route>
        <Route path="/home/customer" element={<Home userType="customer"/>}>
        </Route>
        <Route path="/home/owner" element={<Home userType="owner"/>}>
        </Route>
        <Route path="/searchcar" element={<SearchCar />}>
        </Route>
        <Route path="/postcar" element={<PostCar />}>
        </Route>
        <Route path="/order/customer" element={<OrderHistory userType="customer"/>}>
        </Route>
        <Route path="/order/owner" element={<OrderHistory userType="owner"/>}>
        </Route>
        <Route path="/admin" element={<AdminLogin setLoggedIn={setLoggedIn}/>}>
        </Route>
        <Route path="/admin/dashboard" element={<PrivateAdminRoute element={<AdminDashboard setLoggedIn={setLoggedIn}/>} />}>
        </Route>
        <Route path="/admin/customers" element={<PrivateAdminRoute element={<UserList userType="customer" setLoggedIn={setLoggedIn}/>} />}>
        </Route>
        <Route path="/admin/owners" element={<PrivateAdminRoute element={<UserList userType="owner" setLoggedIn={setLoggedIn}/>} />}>
        </Route>
        <Route path="/admin/cars" element={<PrivateAdminRoute element={<CarList setLoggedIn={setLoggedIn}/>} />}>
        </Route>
      </Routes>
    </div>
    </ChakraProvider>
  )
}
export default App;
