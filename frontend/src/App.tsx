import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth.service';

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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            authService.isAuthenticated() ? <Navigate to="/" /> : <div>Login</div>
          } />
          <Route path="/register" element={
            authService.isAuthenticated() ? <Navigate to="/" /> : <div>Register</div>
          } />
          <Route path="/" element={
            authService.isAuthenticated() ? <div>Dashboard</div> : <Navigate to="/login" />
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
