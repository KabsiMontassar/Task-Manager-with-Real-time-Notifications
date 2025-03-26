import { toast as originalToast } from '@/components/ui/use-toast';

export const showToast = (options: Parameters<typeof originalToast>[0]) => {
  originalToast(options);
};
