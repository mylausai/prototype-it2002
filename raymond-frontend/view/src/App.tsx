// App.tsx

import './App.scss'
import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Home from './Home'
import LoginPage from './LoginPage'
import CreateAccountPage from './CreateAccountPage'
import SearchCar from './SearchCar'
import ChosenCar from './ChosenCar'
import HomePage from './HomePage'
import PostCar from './PostCar'
import OrderHistory from './OrderHistory'
import AdminDashboard from './AdminDashboard'
import UserList from './UserList'
import CarList from './CarList'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
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
        <Route path="/create/customer" element={<CreateAccountPage userType="customer"/>}>
        </Route>
        <Route path="/create/owner" element={<CreateAccountPage userType="owner"/>}>
        </Route>
        <Route path="/searchcar" element={<SearchCar />}>
        </Route>
        <Route path="/car/:id" element={<ChosenCar />}>
        </Route>
        <Route path="/postcar" element={<PostCar />}>
        </Route>
        <Route path="/order/customer" element={<OrderHistory userType="customer"/>}>
        </Route>
        <Route path="/order/owner" element={<OrderHistory userType="owner"/>}>
        </Route>
        <Route path="/admin" element={<AdminDashboard/>}>
        </Route>
        <Route path="/admin/customers" element={<UserList userType="customer"/>}>
        </Route>
        <Route path="/admin/owners" element={<UserList userType="owner"/>}>
        </Route>
        <Route path="/admin/cars" element={<CarList/>}>
        </Route>
      </Routes>
    </div>
    </ChakraProvider>
  )
}
export default App;
