
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskBoard } from './components/TaskBoard';
import './styles/globals.css';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Task Manager</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <TaskBoard />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
