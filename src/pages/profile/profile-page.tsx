import React, { useState } from 'react';
import { useUserProfile } from '@/context/user-profile-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditProfileForm } from '@/components/profile/edit-profile-form';

const ProfilePage: React.FC = () => {
  const { profile, userRole, isProfileLoading } = useUserProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    // Default to male avatars for simplicity since we don't store gender in profile
    return 'https://xsgames.co/randomusers/avatar.php?g=male';
  };

  if (isProfileLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Button onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={getAvatarUrl()} 
                  alt={profile.full_name || profile.email}
                />
                <AvatarFallback>{getInitials(profile.full_name, profile.email)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profile.full_name || 'No name set'}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Job Title:</span>
                <span className="ml-2">{profile.job_title || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <span className="ml-2 capitalize">{userRole || 'No role assigned'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Last Login:</span>
                <span className="ml-2">
                  {profile.last_login_at
                    ? format(new Date(profile.last_login_at), 'dd/MM/yyyy HH:mm')
                    : 'Never'}
                </span>
              </div>
              <div>
                <span className="font-medium">Profile Created:</span>
                <span className="ml-2">
                  {format(new Date(profile.created_at), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm profile={profile} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage; 