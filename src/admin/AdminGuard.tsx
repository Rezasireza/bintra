import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { Loader2, AlertCircle } from 'lucide-react';

interface AdminContextType {
    session: Session | null;
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    error: string | null;
}

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms

const AdminContext = createContext<AdminContextType>({
    session: null,
    user: null,
    isAdmin: false,
    loading: true,
    error: null,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminGuard: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<AdminContextType>({
        session: null,
        user: null,
        isAdmin: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async (session: Session | null) => {
            if (!session) {
                if (mounted) {
                    setState(prev => ({ ...prev, session: null, user: null, isAdmin: false, loading: false }));
                    navigate('/login', { replace: true });
                }
                return;
            }

            try {
                // Check if user is an admin
                const { data, error } = await supabase
                    .from('admins')
                    .select('email')
                    .eq('email', session.user.email)
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;

                if (!data) {
                    throw new Error('Unauthorized: admin access only');
                }

                if (mounted) {
                    setState({
                        session,
                        user: session.user,
                        isAdmin: true,
                        loading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                console.warn('Admin access denied:', err);
                await supabase.auth.signOut();
                if (mounted) {
                    navigate('/login', { replace: true });
                }
            }
        };

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            checkAdmin(session);
        });

        // Listen to changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkAdmin(session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [navigate]);

    // Handle Inactivity Timeout
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const resetTimeout = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                console.warn('Inactivity timeout reached, logging out...');
                await supabase.auth.signOut();
                navigate('/login', { replace: true });
            }, INACTIVITY_TIMEOUT);
        };

        if (state.isAdmin && state.session) {
            resetTimeout();
            const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
            events.forEach(event => window.addEventListener(event, resetTimeout));

            return () => {
                clearTimeout(timeoutId);
                events.forEach(event => window.removeEventListener(event, resetTimeout));
            };
        }
    }, [state.isAdmin, state.session, navigate]);

    if (state.loading) {
        return (
            <div className="min-h-screen bg-[#FDF8EF] flex flex-col items-center justify-center text-gray-800">
                <Loader2 className="animate-spin text-gold-500 mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-wide animate-pulse">Checking session...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-h-screen bg-[#FDF8EF] flex flex-col items-center justify-center text-gray-800 p-6">
                <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center border border-gray-200 shadow-xl shadow-gold-500/10">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Access Error</h2>
                    <p className="text-gray-500 mb-6">{state.error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-gold-500/20"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!state.session || !state.isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <AdminContext.Provider value={state}>
            <Outlet />
        </AdminContext.Provider>
    );
};
