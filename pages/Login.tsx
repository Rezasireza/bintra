import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../src/supabase';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && mounted) {
        navigate('/admin/dashboard', { replace: true });
      }
    });
    return () => { mounted = false; };
  }, [navigate]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@') || !email.includes('.')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    if (!password) {
      setError('Password wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (data.session) navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Gagal login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-800 bg-[#FDF8EF] font-sans selection:bg-gold-500/30">
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gold-600 font-medium text-sm gap-2 transition-colors mb-10">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-gold-900/5">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-amber-500 bg-clip-text text-transparent mb-2">
                Admin CMS
              </h1>
              <p className="text-gray-500 text-sm">Masuk untuk mengelola pengaturan dan data.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="email">Email Admin</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sekolah.edu"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-gold-500 rounded-xl py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 outline-none transition-all ring-gold-500/20 focus:ring-4"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="password">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-gold-500 rounded-xl py-3 pl-11 pr-12 text-gray-800 placeholder:text-gray-400 outline-none transition-all ring-gold-500/20 focus:ring-4 font-mono tracking-wider"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1.5 text-gray-400 hover:text-gold-600 rounded-lg transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative mt-8 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-gold-500/20"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Memproses...</>
                  ) : 'Masuk ke Dashboard'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;