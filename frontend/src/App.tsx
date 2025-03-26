import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TaskBoard } from './components/TaskBoard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { authService } from './services/auth.service';
import './App.css';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              authService.isAuthenticated() ? <Navigate to="/" /> : <LoginForm />
            } />
            <Route path="/register" element={
              authService.isAuthenticated() ? <Navigate to="/" /> : <RegisterForm />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <header className="bg-white shadow-sm">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex h-16 justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-700">
                            {authService.getCurrentUser()?.name}
                          </span>
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
                  <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <ErrorBoundary>
                      <TaskBoard />
                    </ErrorBoundary>
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
