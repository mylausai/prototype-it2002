import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCars, postCar } from './api'

interface Car {
  make_model: string;
  seat_capacity: number;
  pickup_location: string;
  rental_rate: number
}

function PostCar() {
  const [makeModel, setMakeModel] = useState('');
  const [seatCapacity, setSeatCapacity] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [rentalRate, setRentalRate] = useState(''); // to be parsed into number in line 52
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState({owner_id:''});
  useEffect(() => {
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    async function fetchCars() {
      console.log('logged in owner id: ', user.owner_id)
      if (user.owner_id){
        const cars = await getCars(user.owner_id); // cars posted by owner
        if (cars) { // make sure it is not empty
          setCars(Object.values(cars) as Car[]); // converts object into array
        }
      }
    }
    fetchCars();
  }, [user]); // add user as dependency

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const owner_id = user.owner_id;
    const carData = { makeModel, seatCapacity, pickupLocation, rentalRate, owner_id};
    const res = await postCar(carData);
    if (res) {
      // clear the form
      setMakeModel('');
      setPickupLocation('');
      setRentalRate('');
      const newCar: Car = {make_model: makeModel,
                          seat_capacity: seatCapacity,
                          pickup_location: pickupLocation,
                          rental_rate: Number(rentalRate)};
      setCars((cars: Car[])=>[...cars, newCar]);
    } else {
      alert('Failed to post car.');
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Sign out</Link>
          </li>
          <li>
            <Link to="/home/owner">Home</Link>
          </li>
        </ul>
      </nav>    
      <h2>Post a Car</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="make">Make:</label>
        <input type="text" id="make" name="make" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} />

        <label htmlFor="seatCapacity">Seat Capacity:</label>
        <input type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity} onChange={(e) => setSeatCapacity(parseInt(e.target.value))} />

        <label htmlFor="pickup-location">Pickup Location:</label>
        <input type="text" id="pickup-location" name="pickup-location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />

        <label htmlFor="rental-rate">Rental Rate:</label>
        <input type="text" id="rental-rate" name="rental-rate" value={rentalRate} onChange={(e) => setRentalRate(e.target.value)} />

        <button type="submit">Post Car</button>
      </form>
      <h2>Your Cars</h2>
      {cars.length === 0 ? (
        <p>You have not posted any cars yet.</p>
      ) : (
        <table>
        <thead>
          <tr>
            <th>Make</th>
            <th>Seat Capacity</th>
            <th>Pickup Location</th>
            <th>Rental Rate</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={index}>
              <td>{car.make_model}</td>
              <td>{car.seat_capacity}</td>
              <td>{car.pickup_location}</td>
              <td>{car.rental_rate}</td>
            </tr>
          ))}
        </tbody>
        </table>
      )}
    </div>
  );
}

export default PostCar;


