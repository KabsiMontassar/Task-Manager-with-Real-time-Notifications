import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    staleTime: Infinity,
  });

  return { user };
}
