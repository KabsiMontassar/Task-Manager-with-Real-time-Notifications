import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

 

  const Capitalize = (str?: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }




  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center' , padding: '10px', gap: '10px'}}>
          <div className="user-icon">
            <span>{getInitials(user?.firstName + ' ' + user?.lastName)}</span>
          </div>
          <div className="user-info">
            <h3>{
              Capitalize(user?.firstName) + ' ' + Capitalize(user?.lastName)
            }</h3>
          </div>
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
