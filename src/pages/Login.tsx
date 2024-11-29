import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  otp: string;
};

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_OTP = "777777";

export default function Login() {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const handleEmailSubmit = (data: { email: string }) => {
    setEmailForOTP(data.email);
    setShowOTP(true);
    toast.success("OTP sent successfully!");
  };

  const handleOTPSubmit = (data: LoginFormValues) => {
    if (data.email === ADMIN_EMAIL && data.otp === ADMIN_OTP) {
      toast.success("Welcome back, Admin!");
      navigate("/dashboard");
    } else if (data.otp === "123456") { // Demo client OTP
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid OTP. Please try again.");
      form.resetField("otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-card border rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">
              {showOTP ? "Enter the OTP sent to your email" : "Sign in to your account"}
            </p>
          </div>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(showOTP ? handleOTPSubmit : handleEmailSubmit)} 
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={showOTP}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showOTP && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          OTP
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="bg-background/50"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
              >
                {showOTP ? (
                  <>
                    Verify OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {showOTP && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowOTP(false);
                    form.reset();
                  }}
                >
                  Try different email
                </Button>
              )}
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
} 