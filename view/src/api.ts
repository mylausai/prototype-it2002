import apisauce from 'apisauce'
 
const machineIP = "172.25.77.206" //to change
const machinePort = "2222"
const api = apisauce.create({
  baseURL: `http://${machineIP}:${machinePort}`,
})


interface LoginResponse {
  success: boolean;
  owner?: any;
  customer?: any;
}

interface CreateResponse {
  message: any;
}

export async function login(email: string, password: string, userType: string) {
  // Construct the data to be sent to the server
  const authData = { email, password };

  // Send the data to the server
  const url = userType === 'customer' ? '/api/customer/login' : '/api/owner/login';
  const res = await api.post(url, authData);

  // Handle the response
  if (res.ok) {
      // Authentication succeeded
      console.log("Authentication succeeded!");
      const { success, owner, customer } = res.data as LoginResponse;
      if (owner) {
        alert('Logged in as owner')
        return owner
      }
      else {
        alert('Logged in as customer')
        return customer 
      }
  } else {
      // Authentication failed
      alert("Authentication failed!");
      return false;
  }
}

export async function createUser(accountData: any, userType: string) {
  const url = userType === 'customer' ? '/api/customer/create' : '/api/owner/create';
  const res = await api.post(url, accountData);
  if (res.ok) {
    alert("Account created successfully, please log in");
    return true;
  } else {
    const {message} = res.data as CreateResponse;
    if (message) {
      alert(message);
    } else
    alert('Error in creating account')
    return false;
  }
}

export async function searchCars(pickupLocation: string, seatCapacity: number) {
  const res = await api.post('/api/cars', {pickupLocation, seatCapacity});
  if (res.ok) {
    return res.data;
  } else {
    alert('Error in searching cars');
    return false;
  }
} 

export async function getCars(owner_id: any) {
  const res = await api.post('/api/getcars', owner_id);
  if (res.ok) {
    return res.data;
  } else {
    alert("Error in getting posted cars");
    return false;
  }
}

export async function postCar(carData: any) {
  const res = await api.post('/api/postcar', carData);
  if (res.ok) {
    alert("Car posted successfully");
    return true;
  } else {
    alert("Failed to post car");
    return false;
  }
}

export async function rentCar(customer_id: any, car_id: any, rentalDays: any, rentalCost: any, pickup_location: any) {
  const rentinfo = {customer_id, car_id, rentalDays, rentalCost, pickup_location};
  const res = await api.post('/api/rentcar', rentinfo);
  if (res.ok) {
    alert("Car rented successfully");
    return true;
  } else {
    alert("Failed to rent car");
    return false;
  }
}

export async function getOrders(user_id:any, user_type: any, status: any) {
  const userorder = {user_id, user_type, status};
  const res = await api.post('/api/getorders',  userorder);
  if (res.ok) {
    return res.data;
  } else {
    alert("Failed to retrieve order");
    return false;
  }
}

export async function updateOrder(rental_id:any, status: any) {
  const data = {rental_id, status};
  const res = await api.post('/api/updateorder', data);
  if (res.ok) {
    alert("Order updated successfully");
    return true;
  } else {
    alert("Failed to update order");
    return false;
  }
}

export async function getStats() {
  const res = await api.post('/api/getstats');
  if (res.ok) {
    return res.data;
  } else {
    alert("Failed to retrieve stats");
    return false;
  }
}

export async function getUsers(user_type: any, id: any) {
  const data = {user_type, id}
  const res = await api.post('/api/getusers', data);
  if (res.ok) {
    return res.data;
  } else {
    alert("Failed to retrieve users");
    return false;
  }
}

export async function deleteUser(id: any, user_type: any) {
  const data = {id, user_type}
  const res = await api.post('/api/deleteuser', data);
  if (res.ok) {
    alert("User deleted successfully");
    return true;
  } else {
    alert("Failed to delete user");
    return false;
  }
}

export async function listCars() {
  const res = await api.post('/api/listcars');
  if (res.ok) {
    return res.data;
  } else {
    alert("Failed to retrieve cars");
    return false;
  }
}

export async function deleteCar(car_id: any) {
  const res = await api.post('/api/deletecar', car_id);
  if (res.ok) {
    alert("Car deleted successfully");
    return true;
  } else {
    alert("Failed to delete car");
    return false;
  }
}

export async function updateUser(data: any) {
  const res = await api.post('/api/updateuser', data);
  if (res.ok) {
    alert("User details updated successfully");
    return true;
  } else {
    alert("Failed to update user details");
    return false;
  }
}

export async function updateCar(data: any) {
  const res = await api.post('/api/updatecar', data);
  if (res.ok) {
    alert("Car details updated successfully");
    return true;
  } else {
    alert("Failed to update car details");
    return false;
  }
}

export async function adminlogin(data: any) {
  const res = await api.post('/api/adminlogin', data);
  if (res.ok) {
    alert("Logged in as admin");
    return true;
  } else {
    alert("Authentication failed");
    return false;
  }
}