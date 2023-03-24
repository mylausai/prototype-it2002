import { searchCars } from './api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './searchcar.css'

function SearchCar() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('1');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    const results = await searchCars(pickupLocation, seatCapacity); 
    setSearchResults(results);
  }

  const handleChoose = (car) => {
    // Save the chosen car information to the redirected page
    navigate(`/car/${car.id}`, { state:car });
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Sign out</Link>
          </li>
          <li>
            <Link to="/home/customer">Home</Link>
          </li>
        </ul>
      </nav>
      <div>
        <form onSubmit={handleSearch}>
          <label htmlFor="pickupLocation">Pickup Location:</label>
          <input type="text" id="pickupLocation" name="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />

          <label htmlFor="seatCapacity">Seat Capacity:</label>
          <input type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity} onChange={(e) => setSeatCapacity(e.target.value)} />

          <button type="submit">Search</button>
        </form>
      </div> 

      <div>
        {searchResults && searchResults.length > 0 &&
          <table>
            <thead>
              <tr>
                <th>Make_model</th>
                <th>Seat Capacity</th>
                <th>Pickup Location</th>
                <th>Rental Price</th>
                <th>Choose</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((car, index) => (
                <tr key={index}>
                  <td>{car.make_model}</td>
                  <td>{car.seat_capacity}</td>
                  <td>{car.pickup_location}</td>
                  <td>{car.rental_rate}</td>
                  <td><button onClick={() => handleChoose(car)}>Choose</button></td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>
    </div>
  );
}

export default SearchCar;
