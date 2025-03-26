import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';

interface UserProfile {
  id: string;
  name: string;
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="user-icon">
          <span>{user ? getInitials(user.name) : ''}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="main-content">
        <h1>TaskManagement</h1>
      </div>
    </div>
  );
};

export default HomePage;
