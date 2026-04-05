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
    { label: "Home", to: "/home" },
    { label: "Plans", to: "/plans" },
    { label: "Training Tips", to: "/training-tips" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "shadow-[0_4px_0_hsl(var(--neon-green))]" : ""
      }`}
      style={{
        backgroundColor: "hsl(var(--void-black))",
        borderBottom: "3px solid hsl(var(--neon-green))",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-sm tracking-widest leading-tight glow-green"
          style={{ color: "hsl(var(--neon-green))" }}
        >
          ⬡ KAIZEN
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-style text-xs ${
                isActive(link.to)
                  ? "text-neon-green glow-green"
                  : "text-chalk-white hover:text-neon-green"
              }`}
            >
              {isActive(link.to) ? `> ${link.label}` : link.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-orange text-xs px-5 py-2">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: "hsl(var(--neon-green))" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "hsl(var(--void-black))",
            borderTop: "2px solid hsl(var(--neon-green))",
          }}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link-style py-3 text-xs border-b ${
                  isActive(link.to) ? "text-neon-green" : "text-chalk-white"
                }`}
                style={{ borderColor: "hsl(var(--void-light))" }}
              >
                {isActive(link.to) ? `> ${link.label}` : link.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-orange text-center mt-4">
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
