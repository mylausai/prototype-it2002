import { searchCars, rentCar } from './api';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import { TbRefresh } from "react-icons/tb"
import './home.css';

interface Car {
  car_id: number;
  make_model: string;
  seat_capacity: number
  pickup_location: string;
  rental_rate: number;
}

function SearchCar() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [seatCapacity, setSeatCapacity] = useState<number | null>();
  const [searchResults, setSearchResults] = useState([{car_id: 0,
                                                      make_model:'',
                                                      seat_capacity:0,
                                                      pickup_location:'',
                                                      rental_rate:0}]);
  const [showAllCars, setShowAllCars] = useState(true);  // list all the cars by default                                                
  const navigate = useNavigate();
  const [chooseClicked, setChooseClicked] = useState(false);

  // For chosen cars
  const location = useLocation();
  //const chosenCar = location.state;
  const [chosenCar, setChosenCar] = useState({
    car_id: '',
    make_model: '',
    seat_capacity: '',
    pickup_location: '',
    rental_rate: -1
  });
  const [rentalDays, setRentalDays] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [user, setUser] = useState({customer_id: ''});
  const [rentalCost, setRentalCost] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  //

  useEffect(() => { // list all the cars by default
    async function fetchCars() {
      const results = await searchCars('', 0) as Car[]; // special case to be handled in app.py
      setSearchResults(results);
    }
    if (showAllCars) {
      fetchCars();
    }
    // For chosen cars
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  }, [showAllCars]); // dependency  

  const handleSearch = async (event: any) => {
    event.preventDefault();
    const results = await searchCars(pickupLocation, seatCapacity || -1) as Car[]; 
    setSearchResults(results);
    setShowAllCars(false); // to be set to true if cancel search
  }

  const handleChoose = (car: any, index:any) => {
    // Save the chosen car information to the redirected page
    // navigate(`/car/${car.car_id}`, { state:car });
    setChooseClicked(true);
    setChosenCar(car);
    setSelectedRowIndex(index);
  }

  const handleCancel = () => {
    setShowAllCars(true);
  }

  // For chosen cars
  const handleDaysChange = (event: any) => {
    setRentalDays(event.target.value);
  };

  const handleConfirm = async () => {
    const customer_id = user.customer_id;
    console.log('chosen car customerid: ', customer_id)
    const car_id = chosenCar.car_id;
    console.log('chonsen car id: ', car_id)
    const rentalCost = chosenCar.rental_rate * rentalDays;
    setRentalCost(rentalCost)
    const res = await rentCar(customer_id, car_id, rentalDays, rentalCost)
    if(res) setIsConfirmed(true); // to be fixed (wait for res ok)

    // alert instead of text in website cause of refresh
    window.alert(`Order Confirmed\nMake/Model: ${chosenCar?.make_model}\nRental Days: ${rentalDays}\nRental Cost: $${rentalCost}`);
    // refresh window so user cannot select confirmed cars
    window.location.reload();
  };
  //

  return (
    <Container className="signed-in-container">
      <nav className="signed-in-nav">
        <ul>
          <li>
            <Link to="/home/customer">Home</Link>
          </li>
          <li  className="selected-tab">
            <Link to="/searchcar" className="no-cursor">Search Cars</Link>
          </li>
          <li>
            <Link to={"/order/customer"}>Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav>    
      <Container className='searchNChosenArea'>
        <Container className='search-car-area'>
          <Container className='post-form'>
            <form onSubmit={handleSearch}>
              <label htmlFor="pickupLocation">Pickup Location:</label>
              <input placeholder="Any" type="text" id="pickupLocation" name="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />

              <label htmlFor="seatCapacity">Seat Capacity:</label>
              <input placeholder="Any" type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity || ''} onChange={(e) => setSeatCapacity(e.target.value ? parseInt(e.target.value) : null)} />
              <Container className="searchCarButtonGroup">
                <Container className='searchcar-button-container'>
                  <Button type="submit" color="#000000" backgroundColor={"#F5DEB3"} h="3vw" w="13vw" fontSize="20px">Search</Button>
                </Container>
                <button onClick={handleCancel} title='Clear fields.'><TbRefresh size={30}/></button>
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
                    <tr key={index} className={index === selectedRowIndex ? 'selected-db-row' : 'postcar-db-rows'}>
                      <td>{car.make_model}</td>
                      <td>{car.seat_capacity}</td>
                      <td>{car.pickup_location}</td>
                      <td>{car.rental_rate}</td>
                      <td><button onClick={() => handleChoose(car, index)}>Choose</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>}
            </Container>
        </Container>
        {chooseClicked && <Container className='chosenCarArea'>
          <Container className='chosenCarForm'>
            <h2>Chosen Car:</h2>
            <p>Make/Model: {chosenCar?.make_model}</p>
            <p>Seat Capacity: {chosenCar?.seat_capacity}</p>
            <p>Pickup Location: {chosenCar?.pickup_location}</p>
            <p>Rental Price: {chosenCar?.rental_rate}</p>
            {/* ...other car details */}

            <label htmlFor="rentalDays">Rental Days:</label>
            <input className='rentDays' type="number" id="rentalDays" value={rentalDays} onChange={handleDaysChange} />

            <br />

            <Button onClick={handleConfirm} className="postcar-button" color="#000000" backgroundColor={"#F5DEB3" as string} h="3vw" w="13vw" fontSize="20px">Confirm</Button>
            
          </Container>
        </Container>}
      </Container>
    </Container>
  );
}
// original refresh button
// {!showAllCars && <button onClick={handleCancel} title='Clear fields.'><TbRefresh size={30}/></button>}
export default SearchCar;
