import { CardStylesProvider } from '@chakra-ui/card/dist/card-context';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from './api';

interface Stats {
    total_customers: number;
    total_owners: number;
    total_cars: number;
    total_pending: number;
    total_ongoing: number;
    total_cancelled: number;
    total_completed: number
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats[]>([])

  useEffect(() => {
    async function fetchStats() {
      const res = await getStats() as Stats[]; 
      setStats(res); 
    }

    fetchStats();
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Sign out</Link>
          </li>
          <li>
            <Link to="/admin">Dashboard</Link>
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
        </ul>
      </nav>
      <h2>Dashboard</h2>
      {stats.length > 0 &&
      <div>
        <h3>Stats</h3>
            <p>Total customers: {stats[0].total_customers}</p>
            <p>Total owners: {stats[0].total_owners}</p>
            <p>Total cars: {stats[0].total_cars}</p>
            <p>Pending rentals: {stats[0].total_pending}</p>
            <p>Ongoing rentals: {stats[0].total_ongoing}</p>
            <p>Cancelled rentals: {stats[0].total_cancelled}</p>
            <p>Completed rentals: {stats[0].total_completed}</p>
      </div>}
    </div>
  );
}

export default AdminDashboard;
