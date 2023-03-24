import apisauce from 'apisauce'
 
const machineIP = "127.0.0.1" //to change
const machinePort = "2222"
const api = apisauce.create({
  baseURL: `http://${machineIP}:${machinePort}`,
})

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
      const { success, owner, customer } = res.data
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
    alert("Failed to create account");
    return false;
  }
}
  
export async function getUsers(email, password) {
    const response = await fetch('http://127.0.0.1:5173/api/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const users = await response.json();
    return users;
} 

export async function searchCars(pickupLocation: string, seatCapacity: string) {
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

export async function rentCar(rentinfo: any) {
  const res = await api.post('/api/rentcar', rentinfo);
  if (res.ok) {
    alert("Car rented successfully");
    return true;
  } else {
    alert("Failed to rent car");
    return false;
  }
}

export async function getOrders(orderinfo: any) {
  const res = await api.post('/api/getorders', orderinfo );
  if (res.ok) {
    return res.data;
  } else {
    alert("Failed to retrieve order");
    return false;
  }
}