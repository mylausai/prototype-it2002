import { CardStylesProvider } from '@chakra-ui/card/dist/card-context';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from './api';
import { Container } from 'react-bootstrap';

interface Stats {
    total_customers: number;
    total_owners: number;
    total_cars: number;
    total_pending: number;
    total_ongoing: number;
    total_cancelled: number;
    total_completed: number
}

interface AdminDashboardProps {
  setLoggedIn: (loggedIn: boolean) => void;
}

function AdminDashboard({ setLoggedIn }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats[]>([])

  useEffect(() => {
    async function fetchStats() {
      const res = await getStats() as Stats[]; 
      setStats(res); 
    }

    fetchStats();
  }, []);

  const handleClick = () => {
    setLoggedIn(false);
  }

  return (
    <Container className="dashboardContainer">
      <nav className='adminNav'>
        <ul>
          <li className="selected-tab">
            <Link className="no-cursor" to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/customers">Customers</Link>
          </li>
          <li>
            <Link to="/admin/owners">Owners</Link>
          </li>
          <li>
            <Link to="/admin/cars">Cars</Link>
          </li>
          <li>
            <Link to="/admin" onClick={handleClick}>Logout</Link>
          </li>
        </ul>
      </nav>
      <Container className='userListArea'>
        <h2>SureCar Statistics</h2>
        {stats.length > 0 &&
        <Container className='statsSection'>
          <Container className='statsRow'>
              <Container className='statsBlock'><p>👥 Total customers:<br/><span className='statsText'>{stats[0].total_customers}</span></p></Container>
              <Container className='statsBlock'><p>👤 Total owners:<br/><span className='statsText'>{stats[0].total_owners}</span></p></Container>
              <Container className='statsBlock'><p>🚗 Total cars:<br/><span className='statsText'>{stats[0].total_cars}</span></p></Container>
          </Container>
          <Container className='statsRow'>
              <Container className='statsBlock'><p>⏳ Pending rentals:<br/><span className='statsText'>{stats[0].total_pending}</span></p></Container>
              <Container className='statsBlock'><p>⏳ Ongoing rentals:<br/><span className='statsText'>{stats[0].total_ongoing}</span></p></Container>
              <Container className='statsBlock'><p>❌ Cancelled rentals:<br/><span className='statsText'>{stats[0].total_cancelled}</span></p></Container>
              <Container className='statsBlock'><p>✅ Completed rentals:<br/><span className='statsText'>{stats[0].total_completed}</span></p></Container>
          </Container>
        </Container>}
      </Container>
    </Container>
  );
}

export default AdminDashboard;
