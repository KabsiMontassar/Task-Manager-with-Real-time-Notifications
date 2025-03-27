
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';



interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }
  



const Sidebar = ({ user }: { user: UserProfile }) => {

    const navigate = useNavigate();
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
    
  return (
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
  )
}

export default Sidebar