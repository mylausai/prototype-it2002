import { searchCars } from './api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import './home.css';

interface Car {
  make_model: string;
  seat_capacity: number
  pickup_location: string;
  rental_rate: number;
}

function SearchCar() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('5');
  const [searchResults, setSearchResults] = useState([{make_model:'',
                                                      seat_capacity:0,
                                                      pickup_location:'',
                                                      rental_rate:0}]);
  const navigate = useNavigate();

  const handleSearch = async (event: any) => {
    event.preventDefault();
    const results = await searchCars(pickupLocation, seatCapacity) as Car[]; 
    setSearchResults(results);
  }

  const handleChoose = (car: any) => {
    // Save the chosen car information to the redirected page
    navigate(`/car/${car.id}`, { state:car });
  }

  return (
    <Container className="signed-in-container">
      <nav className="signed-in-nav">
        <ul>
          <li>
            <Link to="/home/customer">Home</Link>
          </li>
          <li  className="selected-tab">
            <Link to="/searchcar" className="no-cursor">Search Car</Link>
          </li>
          <li>
            <Link to={"/order/owner"}>Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav>    
      <Container className='post-car-area'>
        <Container className='post-form'>
          <form onSubmit={handleSearch}>
            <label htmlFor="pickupLocation">Pickup Location:</label>
            <input placeholder="Any" type="text" id="pickupLocation" name="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />

            <label htmlFor="seatCapacity">Seat Capacity:</label>
            <input placeholder="Any" type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity} onChange={(e) => setSeatCapacity(e.target.value)} />
            <Container className='postcar-button-container'>
              <Button type="submit" color="#000000" backgroundColor={"#F5DEB3"} h="3vw" w="13vw" fontSize="20px">Search</Button>
            </Container>
          </form>
        </Container>
        <Container className='post-database'>
          <h2 className='post-a-car'>Results:</h2>
          {searchResults && searchResults.length > 0 &&
            <table className='postcar-table'>
              <thead>
                <tr className='postcar-db-columns'>
                  <th>Make_model</th>
                  <th>Seat Capacity</th>
                  <th>Pickup Location</th>
                  <th>Rental Price</th>
                  <th>Choose</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((car, index) => (
                  <tr key={index} className='postcar-db-rows'>
                    <td>{car.make_model}</td>
                    <td>{car.seat_capacity}</td>
                    <td>{car.pickup_location}</td>
                    <td>{car.rental_rate}</td>
                    <td><button onClick={() => handleChoose(car)}>Choose</button></td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </Container>
      </Container>
    </Container>
  );
}

export default SearchCar;
