import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!actor || !identity) {
      setIsAdmin(false);
      return;
    }
    actor
      .getCallerUserRole()
      .then((role) => {
        setIsAdmin(role === UserRole.admin);
      })
      .catch(() => setIsAdmin(false));
  }, [actor, identity]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/darshan", label: "Darshan" },
    { to: "/seva", label: "Seva" },
    { to: "/rooms", label: "Rooms" },
    { to: "/donation", label: "Donate" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-maroon shadow-lg border-b-2 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold text-2xl font-display font-bold tracking-wide">
              ॐ Shri Ram Mandir
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/90 hover:text-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                activeProps={{ className: "text-gold font-semibold" }}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-white/90 hover:text-gold px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                activeProps={{ className: "text-gold font-semibold" }}
                data-ocid="nav.admin.link"
              >
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {identity ? (
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <User size={12} />
                  {identity.getPrincipal().toText().slice(0, 10)}...
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-maroon bg-transparent text-xs"
                  onClick={() => clear()}
                  data-ocid="nav.logout.button"
                >
                  <LogOut size={14} className="mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" data-ocid="nav.login.link">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-maroon bg-transparent text-xs"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-ocid="nav.register.link">
                  <Button
                    size="sm"
                    className="bg-saffron hover:bg-saffron/90 text-white text-xs"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile.toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-maroon border-t border-gold/30">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-white/90 hover:text-gold px-3 py-2 rounded-md text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block text-white/90 hover:text-gold px-3 py-2 rounded-md text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-gold/30 flex gap-2">
              {identity ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold text-gold bg-transparent"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut size={14} className="mr-1" /> Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold text-gold bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="bg-saffron text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
