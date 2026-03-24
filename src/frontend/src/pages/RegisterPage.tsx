import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function RegisterPage() {
  const { actor } = useActor();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait, connecting...");
      return;
    }
    if (!identity) {
      toast.error("Please login with Internet Identity first to register.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const passwordHash = btoa(form.password + form.email);
      await actor.registerUser(form.name, form.email, form.phone, passwordHash);
      toast.success(
        "Registration successful! Welcome to Shri Ram Mandir Portal.",
      );
      navigate({ to: "/" });
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-temple-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-saffron text-5xl font-display mb-3">ॐ</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Register
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your devotee profile
          </p>
        </div>
        <Card className="border-gold/30 shadow-temple">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center">
                <UserPlus className="text-white" size={20} />
              </div>
              <div>
                <CardTitle className="font-display text-maroon">
                  Create Account
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in your details to register
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {!identity && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm">
                <p className="font-medium text-amber-700 mb-2">
                  ⚠️ Authentication Required
                </p>
                <p className="text-amber-600 mb-3">
                  You need to login with Internet Identity before registering
                  your profile.
                </p>
                <Button
                  size="sm"
                  className="bg-saffron text-white"
                  onClick={() => login()}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />{" "}
                      Connecting...
                    </>
                  ) : (
                    "Login with Internet Identity"
                  )}
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="rname">Full Name *</Label>
                <Input
                  id="rname"
                  placeholder="Ramesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="register.name.input"
                />
              </div>
              <div>
                <Label htmlFor="remail">Email *</Label>
                <Input
                  id="remail"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="mt-1"
                  data-ocid="register.email.input"
                />
              </div>
              <div>
                <Label htmlFor="rphone">Phone</Label>
                <Input
                  id="rphone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                  data-ocid="register.phone.input"
                />
              </div>
              <div>
                <Label htmlFor="rpassword">Password *</Label>
                <Input
                  id="rpassword"
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="mt-1"
                  data-ocid="register.password.input"
                />
              </div>
              <div>
                <Label htmlFor="rconfirm">Confirm Password *</Label>
                <Input
                  id="rconfirm"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  className="mt-1"
                  data-ocid="register.confirm_password.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-saffron hover:bg-saffron/90 text-white font-semibold"
                disabled={loading || !identity}
                data-ocid="register.submit.button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="text-saffron hover:underline font-medium"
                  data-ocid="register.login.link"
                >
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
