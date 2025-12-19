import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface EmailConfirmationProps {
  initialEmail?: string;
}

const EmailConfirmation = ({ initialEmail }: EmailConfirmationProps) => {
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      return;
    }

    // Fallback: check current session if no initialEmail provided
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !session.user.email_confirmed_at) {
        setEmail(session.user.email || "");
      }
    };
    checkSession();
  }, []);

  const resendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      setConfirmationSent(true);
    } catch (error) {
      console.error("Error resending confirmation:", error);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-negari-light-blue flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-accent/10 rounded-full w-fit mb-4">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl text-primary">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            We've sent a confirmation link to:
          </p>
          <p className="font-semibold text-primary break-all">{email}</p>
          
          {confirmationSent ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Confirmation email sent successfully!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <span>Please check your email and click the confirmation link</span>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or click below to resend.
            </p>
            <Button 
              onClick={resendConfirmation}
              variant="outline"
              disabled={confirmationSent}
              className="w-full"
            >
              Resend Confirmation Email
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Having trouble? Contact our support team for assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;