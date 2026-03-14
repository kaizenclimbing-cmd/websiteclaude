import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "About", to: "/" },
    { label: "Plans & Coaching", to: "/plans" },
    { label: "Training Tips", to: "/training-tips" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{ backgroundColor: "hsl(var(--charcoal))" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl tracking-widest leading-tight"
          style={{ color: "hsl(var(--golden))" }}
        >
          KAIZEN<br className="hidden sm:block" />
          <span className="text-white text-sm tracking-widest font-display">CLIMBING COACHING</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-style ${
                isActive(link.to)
                  ? "text-golden"
                  : "text-white hover:text-golden"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary text-sm font-bold uppercase tracking-wider px-5 py-2">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: "hsl(var(--charcoal))",
            borderColor: "hsl(var(--golden-dark))",
          }}
        >
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link-style py-2 border-b ${
                  isActive(link.to) ? "text-golden" : "text-white"
                }`}
                style={{ borderColor: "hsl(var(--golden-dark))" }}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary text-center mt-2">
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
