import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, FileCheck, Upload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/state/AppContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const userInitial = (
    (user?.name?.trim() || user?.email || "").trim().charAt(0).toUpperCase() ||
    "?"
  );

  const navLinks: Array<{ href: string; label: string; disabled?: boolean }> =
    !isAuthenticated
      ? []
      : user?.role === "teacher"
        ? [
            { href: "/teacher/upload-batch", label: "Upload Batch" },
            { href: "/history", label: "History" },
            { href: "/teacher/edit-results", label: "Edit Results" },
            { href: "/teacher/billing", label: "Payment & Plan" },
          ]
        : [
            { href: "/upload", label: "Upload Paper" },
            { href: "/results", label: "Results" },
            { href: "/history", label: "History" },
          ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container-custom">
        <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
                <FileCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">
                Auto<span className="gradient-text">Grade</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.disabled ? location.pathname : link.href}
                  onClick={(e) => {
                    if (link.disabled) e.preventDefault();
                  }}
                  aria-disabled={link.disabled ? true : undefined}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    link.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "light" ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="User menu"
                          className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold"
                        >
                          {userInitial}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            logout();
                          }}
                        >
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="gradient" size="sm">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-border/50"
              >
                <div className="p-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.disabled ? location.pathname : link.href}
                      onClick={(e) => {
                        if (link.disabled) {
                          e.preventDefault();
                          return;
                        }
                        setIsOpen(false);
                      }}
                      aria-disabled={link.disabled ? true : undefined}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                        link.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : location.pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {(link.label === "Upload Paper" || link.label === "Upload Batch") && (
                        <Upload className="w-4 h-4" />
                      )}
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-border/50 flex gap-2">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        aria-label="Log out"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            Log in
                          </Button>
                        </Link>
                        <Link
                          to="/signup"
                          className="flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="gradient" className="w-full">
                            Sign up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
