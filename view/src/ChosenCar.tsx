import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { rentCar } from './api'

function ChosenCar() {
  const location = useLocation();
  const chosenCar = location.state;
  const [rentalDays, setRentalDays] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [user, setUser] = useState({customer_id: ''});
  const [rentalCost, setRentalCost] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  }, []);

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
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Sign out</Link>
          </li>

          <li>
            <Link to="/searchcar">Search Cars</Link>
          </li>
        </ul>
      </nav>
      <h2>Chosen Car:</h2>
      <p>Make/Model: {chosenCar.make_model}</p>
      <p>Seat Capacity: {chosenCar.seat_capacity}</p>
      <p>Pickup Location: {chosenCar.pickup_location}</p>
      <p>Rental Price: {chosenCar.rental_rate}</p>
      {/* ...other car details */}

      <label htmlFor="rentalDays">Rental Days:</label>
      <input type="number" id="rentalDays" value={rentalDays} onChange={handleDaysChange} />

      <br />

      <button onClick={handleConfirm}>Confirm Order</button>

      {isConfirmed && (
        <div>
          <h3>Order Confirmed</h3>
          <p>Make/Model: {chosenCar.make_model}</p>
          <p>Rental Days: {rentalDays}</p>
          <p>Rental Cost: ${rentalCost}</p>
          {/* ...other order details */}
        </div>
      )}
    </div>
  );
}

export default ChosenCar;

