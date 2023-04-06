import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteCar, listCars } from './api'
import { Container } from 'react-bootstrap';

interface Car {
    car_id: number;
    make_model: string;
    seat_capacity: number
    pickup_location: string;
    rental_rate: number;
    total_rental: number;
}

interface AdminDashboardProps {
    setLoggedIn: (loggedIn: boolean) => void;
}

function CarList({ setLoggedIn }: AdminDashboardProps) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    async function fetchCars() {
        const res = await listCars() as Car[];
        setCars(res);
    } fetchCars();
  }, []);

  const handleDelete = async (car: Car) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
        const car_id = car.car_id;
        await deleteCar(car_id);
        setCars(cars.filter(car => car.car_id !== car.car_id));
    }
  }

  const handleClick = () => {
    setLoggedIn(false);
  }

  return (
    <Container className='userListContainer'>
        <Container className='adminNav'>
            <nav>
                <ul>
                <li>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/admin/customers">Customers</Link>
                </li>
                <li>
                    <Link to="/admin/owners">Owners</Link>
                </li>
                <li className="selected-tab">
                    <Link className="no-cursor" to="/admin/cars">Cars</Link>
                </li>
                <li>
                    <Link to="/admin" onClick={handleClick}>Logout</Link>
                </li>
                </ul>
            </nav>
        </Container>
        <Container className='userListArea'>
            <h2>Car List</h2>
            <table className='admin-table'>
            <thead>
                <tr className='admin-db-columns'>
                <th>Make and Model</th>
                <th>Seat Capacity</th>
                <th>Pickup Location</th>
                <th>Rental Rate</th>
                <th>Number of Rentals</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cars.map((car, index) => (
                <tr key={index} className='admin-db-rows'>
                    <td>{car.make_model}</td>
                    <td>{car.seat_capacity}</td>
                    <td>{car.pickup_location}</td>
                    <td>{car.rental_rate}</td>
                    <td>{car.total_rental}</td>
                    <td className='adminActionButtons'>
                    <button className="cancelButton" onClick={() => handleDelete(car)}>Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </Container>
    </Container>
  );
}

export default CarList;
