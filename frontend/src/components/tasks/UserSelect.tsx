import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userService } from '@/services/user.service';
import { User } from '@/types';

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserSelect = ({ value, onChange }: UserSelectProps) => {
  const [open, setOpen] = useState(false);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? selectedUser.name : "Select user..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  onChange(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="mr-2 h-6 w-6 rounded-full"
                  />
                )}
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
