import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { scrollToId } from '../../src/utils/scroll';

const navLinks: { label: string; sectionId?: string; path?: string }[] = [
  { label: 'Program', sectionId: 'program' },
  { label: 'Pendaftaran', path: '/informasi-ppdb' },
  { label: 'Biaya', sectionId: 'biaya' },
  { label: 'Fasilitas', sectionId: 'fasilitas' },
  { label: 'Beasiswa', path: '/beasiswa' },
  { label: 'Tentang', path: '/about' },
  { label: 'Kontak', path: '/hubungi-kami' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    const timeout = setTimeout(() => {
      navLinks.forEach(({ sectionId }) => {
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate('/?scroll=' + sectionId);
    } else {
      scrollToId(sectionId);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-900/5 ${scrolled || isOpen ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/80 backdrop-blur-md'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-tight group">
          <div className="flex items-center gap-1.5 text-lg md:text-xl tracking-tight">
            <span className="font-bold text-primary-DEFAULT">SMA PLUS</span>
            <span className="font-bold text-gold-500 group-hover:text-gold-600 transition-colors">BINA TRAMPIL</span>
          </div>
          <span className="text-[10px] md:text-[11px] font-medium tracking-wider text-primary-tertiary uppercase">
            Yayasan Bina Trampil
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.path ? (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-gold-500' : 'text-primary-secondary hover:text-gold-500'
                  }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={`/#${link.sectionId}`}
                onClick={(e) => handleNav(e, link.sectionId!)}
                className={`text-sm font-medium transition-colors ${activeId === link.sectionId ? 'text-gold-500' : 'text-primary-secondary hover:text-gold-500'
                  }`}
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="hidden xl:inline-flex">Masuk</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="shadow-lg shadow-gold-500/20">Daftar SPMB</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-primary-DEFAULT hover:bg-gray-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            link.path ? (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium py-2 border-b border-gray-50 ${location.pathname === link.path ? 'text-gold-500' : 'text-primary-DEFAULT'
                  }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={`/#${link.sectionId}`}
                onClick={(e) => handleNav(e, link.sectionId!)}
                className={`text-base font-medium py-2 border-b border-gray-50 ${activeId === link.sectionId ? 'text-gold-500' : 'text-primary-DEFAULT'
                  }`}
              >
                {link.label}
              </a>
            )
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/login" className="w-full">
              <Button variant="secondary" fullWidth>Masuk Portal</Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button fullWidth>Daftar SPMB</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;