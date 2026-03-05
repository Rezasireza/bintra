import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useLandingData } from '../../src/hooks/useLandingData';

const Footer: React.FC = () => {
  const { settings, quickLinks } = useLandingData();

  const bio = settings?.about_text || 'Membangun generasi muda yang siap kerja, siap kuliah, dan siap berwirausaha dengan landasan karakter yang kuat dan keterampilan modern.';
  const address = settings?.address || 'Kp. Lame RT 02/04 Desa Sukasari, Kecamatan Rumpin, Kabupaten Bogor';
  const phone = settings?.phone || '+62 895-0683-5889 (Ibu Dwita)';
  const email = settings?.email || 'info@smaplusbinatrampil.sch.id';
  const ig = settings?.instagram_url || '#';
  const fb = settings?.facebook_url || '#';

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-primary-DEFAULT">SMA PLUS <span className="text-gold-500">BINA TRAMPIL</span></h3>
              <p className="text-sm font-semibold tracking-wider text-primary-tertiary uppercase">Yayasan Bina Trampil</p>
            </div>
            <p className="text-primary-secondary leading-relaxed max-w-md">
              {bio}
            </p>
            <div className="flex gap-4 pt-2">
              <a href={ig} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-all duration-150 hover:-translate-y-[2px] shadow-sm hover:shadow-gold-500/30">
                <Instagram size={20} />
              </a>
              <a href={fb} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-all duration-150 hover:-translate-y-[2px] shadow-sm hover:shadow-gold-500/30">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-bold text-lg text-primary-DEFAULT">Akses Cepat</h4>
            <ul className="space-y-4 text-primary-secondary">
              {quickLinks && quickLinks.length > 0 ? (
                quickLinks.map(link => (
                  <li key={link.id}>
                    <Link to={link.target_id || '/'} className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/about" className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">Profil Sekolah</Link></li>
                  <li><Link to="/informasi-pendaftaran" className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">Informasi PPDB</Link></li>
                  <li><Link to="/contact" className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">Hubungi Kami</Link></li>
                  <li><Link to="/beasiswa" className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">Beasiswa</Link></li>
                  <li><Link to="/portal-e-learning-coming-soon" className="inline-block hover:text-gold-500 transition-all duration-150 hover:-translate-y-[2px]">Portal E-Learning</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-bold text-lg text-primary-DEFAULT">Hubungi Kami</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-primary-secondary">
                <MapPin className="w-5 h-5 text-gold-500 mt-1 shrink-0" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3 text-primary-secondary">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-primary-secondary">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-tertiary">
            &copy; {new Date().getFullYear()} YAYASAN BINA TRAMPIL. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-tertiary">
            <span className="cursor-pointer hover:text-gold-500 transition-all duration-150 hover:-translate-y-[1px]">Privacy Policy</span>
            <span className="cursor-pointer hover:text-gold-500 transition-all duration-150 hover:-translate-y-[1px]">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;