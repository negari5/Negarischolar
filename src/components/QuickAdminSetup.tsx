import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const QuickAdminSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const createSuperAdmin = async () => {
      try {
        // Sign up the super admin
        const { data, error } = await supabase.auth.signUp({
          email: 'negari@gmail.com',
          password: '#DoHardThings5',
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: 'Super Admin',
              account_type: 'admin'
            }
          }
        });

        if (error) {
          console.error('Error creating super admin:', error);
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          });
          return;
        }

        if (data.user) {
          // Update profile to set admin flags
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              account_type: 'admin',
              is_admin: true,
              has_completed_profile: true,
              full_name: 'Super Admin'
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }

          // Add admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'admin'
            });

          if (roleError) {
            console.error('Error adding admin role:', roleError);
          }

          toast({
            title: 'Success!',
            description: 'Super admin account created. You can now log in.'
          });

          // Redirect to home after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Error in admin setup:', error);
      }
    };

    createSuperAdmin();
  }, [toast, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Creating Super Admin Account...</h2>
        <p>Please wait...</p>
      </div>
    </div>
  );
};
