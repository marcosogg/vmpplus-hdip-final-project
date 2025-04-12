import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/lib/api/profiles';
import { updateProfile } from '@/lib/api/profiles';
import { useUserProfile } from '@/context/user-profile-context';

const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  job_title: z.string().max(100).optional(),
  // avatar field removed temporarily
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileFormProps {
  profile: Profile;
  onClose: () => void;
}

export function EditProfileForm({ profile, onClose }: EditProfileFormProps) {
  const { toast } = useToast();
  const { refreshProfile } = useUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      job_title: profile?.job_title || '',
    },
  });

  // Reset form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        job_title: profile.job_title || '',
      });
    }
  }, [profile, form.reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log('onSubmit function started');
    try {
      // Avatar upload functionality temporarily removed
      
      // Prepare update data
      console.log('Attempting to update profile with:', data);
      const updateData = {
        full_name: data.full_name,
        job_title: data.job_title || null,
        // avatar_url removed temporarily
      };
      console.log('Prepared updateData:', updateData);

      // Update profile
      const updateResult = await updateProfile(updateData);
      if (updateResult.error) throw updateResult.error;

      // Refresh profile data
      console.log('Profile update successful, attempting to refresh...');
      await refreshProfile();
      console.log('Profile refresh called.');

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      onClose();
    } catch (error) {
      console.error("Error during profile update:", error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your job title" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar field removed temporarily */}
        <div className="mt-1 text-sm text-muted-foreground">
          Avatar upload is temporarily disabled.
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 