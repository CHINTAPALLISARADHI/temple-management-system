import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  return (
    <main className="min-h-screen bg-temple-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-saffron text-5xl font-display mb-3">ॐ</div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to Shri Ram Mandir Portal
          </p>
        </div>
        <Card className="border-gold/30 shadow-temple">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center">
                <ShieldCheck className="text-white" size={32} />
              </div>
            </div>
            <CardTitle className="font-display text-maroon">
              Internet Identity Login
            </CardTitle>
            <CardDescription className="text-sm">
              This portal uses ICP's Internet Identity — a secure, passwordless
              authentication system on the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-8">
            <div className="bg-saffron/5 border border-saffron/20 rounded-lg p-4 mb-6 text-sm text-foreground/70">
              <p className="font-medium text-saffron mb-1">
                🔐 What is Internet Identity?
              </p>
              <p>
                Internet Identity (II) is a decentralized authentication system
                built on the Internet Computer Protocol. No passwords, no data
                leaks — just secure cryptographic keys stored on your device.
              </p>
            </div>
            <Button
              className="w-full bg-saffron hover:bg-saffron/90 text-white font-semibold py-3 text-base"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="login.submit.button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-6">
              New to the portal?{" "}
              <Link
                to="/register"
                className="text-saffron hover:underline font-medium"
                data-ocid="login.register.link"
              >
                Register your profile
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
