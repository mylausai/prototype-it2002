import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCars, postCar, updateCar, deleteCar } from './api'
import { Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import './home.css';

interface Car {
  car_id: number;
  make_model: string;
  seat_capacity: number;
  pickup_location: string;
  rental_rate: number;
  available: boolean
}

function PostCar() {
  const [makeModel, setMakeModel] = useState('');
  const [seatCapacity, setSeatCapacity] = useState(5); 
  const [pickupLocation, setPickupLocation] = useState('');
  const [rentalRate, setRentalRate] = useState(0); // to be parsed into number in line 52
  const [cars, setCars] = useState<Car[]>([]);

  const [editingCar, setEditingCar] = useState<number | null>(null); // state variable to track the row being edited
  const [rentalRateEdit, setRentalRateEdit] = useState(0);
  const [pickupLocationEdit, setPickupLocationEdit] = useState('');
  
  const [refresh, setRefresh] = useState(true);
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    async function fetchCars() {
      if (user.owner_id){
        const cars = await getCars(user.owner_id); // cars posted by owner
        if (cars) { // make sure it is not empty
          setCars(Object.values(cars) as Car[]); // converts object into array
        }
      }
    }
    fetchCars();
  }, [user, refresh]); // add user as dependency (and edit car)

  const handleEdit = (index: number) => {
    setEditingCar(index);
    setPickupLocationEdit(cars[index].pickup_location)
    setRentalRateEdit(cars[index].rental_rate)
  };

  const handleSave = async (index: number) => {
    const isConfirmed = window.confirm("Confirm changes?");
    if (isConfirmed) {
      const car_id = cars[index].car_id;
      const data = {car_id, rentalRateEdit, pickupLocationEdit};

      await updateCar(data);
      setEditingCar(null); // revert
      setRentalRateEdit(0); // clear input history
      setPickupLocationEdit('');
      setRefresh(refresh ? false : true);
    }
  };

  const handleCancel = () => {
    setEditingCar(null);
    setRentalRateEdit(0);
    setPickupLocationEdit('');
  };

  const handleDelete = async (index: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      const car_id = cars[index].car_id;
      await deleteCar(car_id);
      setRefresh(refresh ? false : true);
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const owner_id = user.owner_id;
    const carData = { makeModel, seatCapacity, pickupLocation, rentalRate, owner_id};
    const res = await postCar(carData);
    if (res) {
      // clear the form
      setMakeModel('');
      setPickupLocation('');
      setRentalRate(0);
      setRefresh(refresh ? false : true);
    }
  };

  return (
    <Container className="signed-in-container-postcar">
      <nav className="owner-signed-in-nav">
        <ul>
          <li>
            <Link to="/home/owner" state={user}>Home</Link>
          </li>
          <li  className="selected-tab">
            <Link to="/postcar" state={user} className="no-cursor">Post Car</Link>
          </li>
          <li>
            <Link to="/order/owner" state={user}>Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav>    
      <Container className='post-car-area'>
        <Container className='post-form'>
          <h2 className='post-a-car'>Post a Car</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="make">Make:</label>
            <input type="text" id="make" name="make" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} />

            <label htmlFor="seatCapacity">Seat Capacity:</label>
            <input type="number" id="seatCapacity" name="seatCapacity" value={seatCapacity} onChange={(e) => setSeatCapacity(parseInt(e.target.value))} />

            <label htmlFor="pickup-location">Pickup Location:</label>
            <input type="text" id="pickup-location" name="pickup-location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />

            <label htmlFor="rental-rate">Rental Rate:</label>
            <input type="number" id="rental-rate" name="rental-rate" value={rentalRate} onChange={(e) => setRentalRate(parseInt(e.target.value))} />
            <Container className='postcar-button-container'>
              <Button className="postcar-button" type="submit" color="#000000" backgroundColor={"#F5DEB3"} h="3vw" w="13vw" fontSize="20px">Post Car</Button>
            </Container>
          </form>
        </Container>
        <Container className='post-database'>
          <h2 className='post-a-car'>Your Cars</h2>
          {cars.length === 0 ? (
            <p>You have not posted any cars.</p>
          ) : (
            <table className='postcar-table'>
            <thead>
              <tr className='postcar-db-columns'>
                <th>Make</th>
                <th>Seat Capacity</th>
                <th>Pickup Location</th>
                <th>Rental Rate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index} className='postcar-db-rows'>
                  <td className={`${car.available ? '' : 'bookedRow'}`}>{car.make_model}</td>
                  <td className={`${car.available ? '' : 'bookedRow'}`}>{car.seat_capacity}</td>
                  <td className={`${car.available ? '' : 'bookedRow'}`}>{editingCar === index ? (
                    <>
                      <input
                          type="text"
                          size={15}
                          value={pickupLocationEdit}
                          onChange={(e) => setPickupLocationEdit(e.target.value)}
                        />
                    </> 
                  ) : (
                    <>
                      {car.pickup_location}
                    </>
                  )}
                  </td>
                  <td className={`${car.available ? 'postCarButtonFields' : 'postCarButtonFields bookedRow'}`}>{editingCar === index ? (
                      <>
                        <input
                          type="number"
                          value={rentalRateEdit}
                          onChange={(e) => setRentalRateEdit(parseInt(e.target.value))}
                        />
                        <button className="saveButton" onClick={() => handleSave(index)}>Save</button>
                        <button className="cancelButton" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (              
                      <>
                        <Container className='rentalField'>
                          {car.rental_rate}                        
                          <button className="completeButton" onClick={() => handleEdit(index)}>Edit</button>
                        </Container>                          
                      </>
                    )}
                  </td>
                  <td className={`${car.available ? '' : 'bookedRow'}`}>{car.available ? 'Available' : 'Booked' }</td>
                  <td className={`${car.available ? 'postCarButtonFields' : 'postCarButtonFields bookedRow'}`}>
                    {car.available && (
                      <button className="cancelButton" onClick={() => handleDelete(index)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        </Container>
      </Container>
    </Container>
  );
}

export default PostCar;