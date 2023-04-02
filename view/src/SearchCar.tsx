import { searchCars } from './api';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './searchcar.css'

interface Car {
  car_id: number;
  make_model: string;
  seat_capacity: number
  pickup_location: string;
  rental_rate: number;
}

function SearchCar() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [seatCapacity, setSeatCapacity] = useState(1);
  const [searchResults, setSearchResults] = useState([{car_id: 0,
                                                      make_model:'',
                                                      seat_capacity:0,
                                                      pickup_location:'',
                                                      rental_rate:0}]);
  const [showAllCars, setShowAllCars] = useState(true);  // list all the cars by default                                                
  const navigate = useNavigate();

  useEffect(() => { // list all the cars by default
    async function fetchCars() {
      const results = await searchCars('', 0) as Car[]; // special case to be handled in app.py
      setSearchResults(results);
    }
    if (showAllCars) {
      fetchCars();
    }
  }, [showAllCars]); // dependency  

  const handleSearch = async (event: any) => {
    event.preventDefault();
    const results = await searchCars(pickupLocation, seatCapacity) as Car[]; 
    setSearchResults(results);
    setShowAllCars(false); // to be set to true if cancel search
  }

  const handleChoose = (car: any) => {
    // Save the chosen car information to the redirected page
    navigate(`/car/${car.car_id}`, { state:car });
  }

  const handleCancel = () => {
    setShowAllCars(true);
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
          <input type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity} onChange={(e) => setSeatCapacity(parseInt(e.target.value))} />

          <button type="submit">Search</button>
          {!showAllCars && <button onClick={handleCancel}>Cancel</button>}
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
