import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, FileCheck, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UserRole = "student" | "tutor";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Signup UI Demo",
        description: "This is a UI-only demo. Backend authentication is handled by Django.",
      });
    }, 1500);
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25">
                <FileCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl">
                Paper<span className="gradient-text">Check</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join thousands of students & tutors</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                      role === "student"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <GraduationCap className={cn(
                      "w-6 h-6",
                      role === "student" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium",
                      role === "student" ? "text-primary" : "text-muted-foreground"
                    )}>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("tutor")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                      role === "tutor"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <BookOpen className={cn(
                      "w-6 h-6",
                      role === "tutor" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium",
                      role === "tutor" ? "text-primary" : "text-muted-foreground"
                    )}>Tutor</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-8 text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
