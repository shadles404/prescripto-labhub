
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [lastEmailUsed, setLastEmailUsed] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    setEmailNotConfirmed(false);
    setLastEmailUsed(values.email);
    const { error, errorType } = await signIn(values.email, values.password);
    
    if (error) {
      console.error("Login error:", error);
      
      if (errorType === "email_not_confirmed") {
        setEmailNotConfirmed(true);
        toast.error("Email not confirmed", {
          description: "Please check your inbox for a confirmation email and follow the instructions to verify your account.",
        });
      } else {
        setAuthError(
          error.message === "Invalid login credentials"
            ? "The email or password you entered is incorrect."
            : error.message
        );
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
        });
      }
    } else {
      toast.success("Login successful", {
        description: "Welcome to Saafi Hospital Management System!",
      });
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastEmailUsed) return;
    
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: lastEmailUsed,
      });
      
      if (error) {
        toast.error("Failed to resend confirmation email", { 
          description: error.message 
        });
      } else {
        toast.success("Confirmation email sent", { 
          description: "Please check your inbox and follow the instructions to verify your account." 
        });
      }
    } catch (err) {
      console.error("Error resending confirmation:", err);
      toast.error("Failed to resend confirmation email");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-md bg-medical-blue flex items-center justify-center">
            <span className="text-white font-semibold text-lg">SF</span>
          </div>
          <CardTitle className="text-2xl font-bold">Saafi Hospital</CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailNotConfirmed && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-3">
                <span>Your email is not confirmed. Please check your inbox for a verification email and follow the instructions.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto flex items-center gap-2"
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                >
                  <Mail className="h-4 w-4" />
                  {resendingEmail ? "Sending..." : "Resend confirmation email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        type="email" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {authError && !emailNotConfirmed && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {authError}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            Contact your administrator if you need access to the system.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
