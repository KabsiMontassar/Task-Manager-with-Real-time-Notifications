import { Link, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { UserRole } from '@/types';
import { Bell } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Task Manager</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-b-2 border-indigo-500 text-gray-900'
                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tasks
              </Link>
              {currentUser?.role === UserRole.ADMIN && (
                <Link
                  to="/users"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/users')
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Users
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link
              to="/profile"
              className={`inline-flex items-center gap-2 ${
                isActive('/profile')
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium">{currentUser?.name}</span>
            </Link>
            <button
              onClick={() => authService.logout()}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
