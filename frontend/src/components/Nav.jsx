import { useEffect, useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { BRAND, NAV_LINKS } from "@/lib/content";
import { scrollToId } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      data-testid="site-nav"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#FAF9F6]/85 border-b border-[#E5E1D8]/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 h-[80px] sm:h-[96px] lg:h-[104px] flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => handleNav("home")}
          className="flex items-center"
        >
          <img
            src={BRAND.logoUrl}
            alt="CLA Aesthetics & Wellness"
            className="h-[60px] w-[60px] sm:h-[72px] sm:w-[72px] lg:h-[84px] lg:w-[84px] object-contain rounded-full"
          />
        </button>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => handleNav(l.id)}
              className="text-[13px] tracking-[0.14em] uppercase text-[#5C5A59] hover:text-[#2C2A29] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && typeof user === "object" ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === "admin" ? "/admin" : "/portal"}
                data-testid="nav-account"
                className="inline-flex items-center gap-2 rounded-full border border-[#2C2A29]/25 text-[#2C2A29] px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
              >
                <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                {user.role === "admin" ? "Dashboard" : "My portal"}
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  nav("/");
                }}
                data-testid="nav-logout"
                aria-label="Sign out"
                className="h-10 w-10 grid place-items-center rounded-full border border-[#2C2A29]/20 text-[#5C5A59] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              data-testid="nav-signin"
              className="text-[12px] uppercase tracking-[0.22em] text-[#5C5A59] hover:text-[#2C2A29] transition-colors"
            >
              Sign in
            </Link>
          )}
          <button
            data-testid="nav-book-now"
            onClick={() => handleNav("contact")}
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#2C2A29] text-white px-6 py-3 text-[12px] tracking-[0.22em] uppercase transition-all hover:bg-[#D4AF37] hover:shadow-[0_18px_40px_-18px_rgba(212,175,55,0.7)]"
          >
            <span>Book Now</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] group-hover:bg-white transition-colors" />
          </button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                data-testid="mobile-menu-trigger"
                aria-label="Open menu"
                className="h-11 w-11 grid place-items-center rounded-full border border-[#E5E1D8] bg-white/70 backdrop-blur"
              >
                <Menu className="h-5 w-5 text-[#2C2A29]" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#FAF9F6] border-l border-[#E5E1D8] w-[88%] sm:w-[420px] p-0"
            >
              <div className="h-full flex flex-col p-8">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse sections of the CLA Aesthetics & Wellness site.
                </SheetDescription>
                <div className="flex items-center justify-between">
                  <img
                    src={BRAND.logoUrl}
                    alt="CLA"
                    className="h-[72px] w-[72px] object-contain rounded-full"
                  />
                  <button
                    aria-label="Close menu"
                    data-testid="mobile-menu-close"
                    onClick={() => setOpen(false)}
                    className="h-10 w-10 grid place-items-center rounded-full border border-[#E5E1D8]"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="mt-12 flex-1 flex flex-col gap-6">
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.id}
                      data-testid={`mobile-nav-link-${l.id}`}
                      onClick={() => handleNav(l.id)}
                      className="text-left font-serif-display text-3xl text-[#2C2A29]"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <button
                  data-testid="mobile-book-now"
                  onClick={() => handleNav("contact")}
                  className="w-full rounded-full bg-[#D4AF37] text-white py-4 text-[12px] tracking-[0.25em] uppercase"
                >
                  Book Your Session
                </button>
                {user && typeof user === "object" ? (
                  <Link
                    to={user.role === "admin" ? "/admin" : "/portal"}
                    onClick={() => setOpen(false)}
                    data-testid="mobile-nav-account"
                    className="w-full inline-flex items-center justify-center gap-2 mt-3 rounded-full border border-[#2C2A29]/25 text-[#2C2A29] py-3.5 text-[12px] tracking-[0.22em] uppercase"
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    {user.role === "admin" ? "Dashboard" : "My portal"}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    data-testid="mobile-nav-signin"
                    className="w-full inline-flex items-center justify-center mt-3 rounded-full border border-[#2C2A29]/25 text-[#2C2A29] py-3.5 text-[12px] tracking-[0.22em] uppercase"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
