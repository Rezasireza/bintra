import React from 'react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { MapPin, Phone, User, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20">
      <Section bg="cream">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-DEFAULT mb-4">Kontak & Lokasi</h1>
          <p className="text-lg text-primary-secondary">Hubungi kami untuk informasi lebih lanjut mengenai pendaftaran dan sekolah.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          
          {/* Info Side */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-primary-DEFAULT">Informasi Kontak</h2>
            
            <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 bg-cream-50 rounded-xl">
                 <Phone className="w-6 h-6 text-gold-500 mt-1" />
                 <div>
                   <h3 className="font-bold text-primary-DEFAULT mb-1">WhatsApp Pendaftaran</h3>
                   <p className="text-primary-secondary text-lg font-medium">+62 895-0683-5889</p>
                   <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => window.open('https://wa.me/6289506835889', '_blank')}
                   >Chat Sekarang</Button>
                 </div>
               </div>

               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                 <User className="w-6 h-6 text-gold-500 mt-1" />
                 <div>
                   <h3 className="font-bold text-primary-DEFAULT mb-1">Contact Person</h3>
                   <p className="text-primary-secondary">Ibu Dwita Anggareni</p>
                 </div>
               </div>

               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                 <MapPin className="w-6 h-6 text-gold-500 mt-1" />
                 <div>
                   <h3 className="font-bold text-primary-DEFAULT mb-1">Alamat Sekolah</h3>
                   <p className="text-primary-secondary leading-relaxed">
                     Kp. Lame RT 02/04 Desa Sukasari, Kecamatan Rumpin, Kabupaten Bogor
                   </p>
                   <button 
                     className="text-gold-600 font-bold text-sm mt-2 hover:underline flex items-center gap-1"
                     onClick={() => window.open('https://maps.google.com/?q=SMA+PLUS+BINA+TRAMPIL+Rumpin+Bogor', '_blank')}
                   >
                     Buka Google Maps
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white">
            <h2 className="text-2xl font-bold text-primary-DEFAULT mb-6">Kirim Pesan</h2>
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary-DEFAULT">Nama</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-500 focus:ring-1 outline-none" placeholder="Nama Anda" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-primary-DEFAULT">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-500 focus:ring-1 outline-none" placeholder="email@anda.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-primary-DEFAULT">Pesan</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-500 focus:ring-1 outline-none resize-none" placeholder="Tulis pertanyaan atau pesan Anda disini..."></textarea>
              </div>
              <Button fullWidth className="gap-2">
                <Send size={18} /> Kirim Pesan
              </Button>
            </form>
          </div>

        </div>
      </Section>
    </div>
  );
};

export default Contact;