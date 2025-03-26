import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navigation } from './components/layout/Navigation';
import { TaskBoard } from './components/TaskBoard';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route index element={<TaskBoard />} />
                        <Route path="profile" element={<Profile />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
