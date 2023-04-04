import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteCar, listCars } from './api'

interface Car {
    car_id: number;
    make_model: string;
    seat_capacity: number
    pickup_location: string;
    rental_rate: number;
    total_rental: number;
}

function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    async function fetchCars() {
        const res = await listCars() as Car[];
        setCars(res);
    } fetchCars();
  }, []);

  const handleDelete = async (car: Car) => {
    const car_id = car.car_id;
    await deleteCar(car_id);
    setCars(cars.filter(car => car.car_id !== car.car_id));
  }

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
        <h2>Car List</h2>
        <table>
        <thead>
            <tr>
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
            <tr key={index}>
                <td>{car.make_model}</td>
                <td>{car.seat_capacity}</td>
                <td>{car.pickup_location}</td>
                <td>{car.rental_rate}</td>
                <td>{car.total_rental}</td>
                <td>
                <button onClick={() => handleDelete(car)}>Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}

export default CarList;
