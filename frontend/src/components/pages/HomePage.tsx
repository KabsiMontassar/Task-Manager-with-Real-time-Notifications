import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import Sidebar from '../Sidebar';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {user && <Sidebar user={user} />}
      <div className="main-content">
        <h1>TaskManagement</h1>
      </div>
    </div>
  );
};

export default HomePage;
