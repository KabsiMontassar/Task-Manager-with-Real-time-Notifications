import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types';

export const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      updateProfileMutation.mutate({ ...profile, ...formData });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-20 w-20 rounded-full"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-2xl font-medium text-indigo-600">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <Button variant="outline" type="button">
                    Change Avatar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={profile.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={profile.email}
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {profile.tasks.length > 0 ? (
                profile.tasks.map((taskId) => (
                  <div key={taskId} className="py-4">
                    Task {taskId}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tasks assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {profile.notifications.length > 0 ? (
                profile.notifications.map((notificationId) => (
                  <div key={notificationId} className="py-4">
                    Notification {notificationId}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No notifications</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
