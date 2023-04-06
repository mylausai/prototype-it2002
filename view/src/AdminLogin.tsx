import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import './admin.css';
import { useNavigate } from 'react-router-dom';
import { adminlogin } from './api';

interface AdminLoginProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

function AdminLogin({ setLoggedIn }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLoginSubmit = async (event: any) => {
    event.preventDefault();
    const data = {username, password};
    const res = await adminlogin(data);
    if (res){
      setLoggedIn(true); 
      navigate("/admin/dashboard");
    }
  };

  return (
    <Container className='adminArea'>
        <Container className='adminBox'>
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLoginSubmit}>
                <div>
                <label htmlFor="username">Username</label>
                <input type="username" id="username" name="username" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Container className='adminLoginButton'>
                  <Button backgroundColor={"#0E1F34" as string} _hover={{bg: '#eeebe5', color: '#0E1F34'}} type="submit">Login</Button>
                </Container>
            </form>
        </Container>
    </Container>
  );
}

export default AdminLogin;