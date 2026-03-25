import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

export default function AuthPage() {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (user && role) return <Navigate to={role === "admin" ? "/admin" : role === "team_member" ? "/team" : "/client"} replace />;
  if (user && !role) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Waiting for role assignment. Contact your administrator.</p></div>;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background text-lg font-bold">Z</div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Zentura</h1>
            <p className="text-lg text-muted-foreground">Your agency management platform</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Sign in or sign up for free<br />with your work email
          </p>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Client Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center pt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right: Product Preview Image */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-muted/30 p-8">
        <div className="relative max-w-2xl w-full">
          <img
            src={dashboardPreview}
            alt="Zentura CRM Dashboard Preview"
            className="w-full h-auto rounded-xl shadow-2xl"
            width={1280}
            height={960}
          />
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@work-email.com" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="h-11" />
      </div>
      <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
    </form>
  );
}

function SignUpForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName, company);
    if (error) toast.error(error.message);
    else toast.success("Account created! You can now sign in.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input id="signup-name" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Jane Doe" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-company">Company</Label>
        <Input id="signup-company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@work-email.com" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className="h-11" />
      </div>
      <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "Creating account..." : "Create Client Account"}</Button>
    </form>
  );
}
