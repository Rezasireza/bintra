import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface LandingData {
    settings: any;
    heroCards: any[];
    phases: any[];
    requirements: any[];
    pricing: any[];
    facilities: any[];
    scholarships: any[];
    testimonials: any[];
    quickLinks: any[];
    gallery?: any[];
    loading: boolean;
    error: Error | null;
}

export const useLandingData = (): LandingData => {
    const [data, setData] = useState<LandingData & { gallery: any[] }>({
        settings: {},
        heroCards: [],
        phases: [],
        requirements: [],
        pricing: [],
        facilities: [],
        scholarships: [],
        testimonials: [],
        quickLinks: [],
        gallery: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const [
                    settingsRes,
                    heroCardsRes,
                    phasesRes,
                    reqsRes,
                    pricingRes,
                    facsRes,
                    scholarsRes,
                    testsRes,
                    linksRes,
                    galleryRes
                ] = await Promise.all([
                    supabase.from('landing_settings').select('*').limit(1).maybeSingle(),
                    supabase.from('hero_cards').select('*').order('order', { ascending: true }),
                    supabase.from('registration_phases').select('*').order('order', { ascending: true }),
                    supabase.from('requirements').select('*').order('order', { ascending: true }),
                    supabase.from('pricing_cards').select('*').limit(1).maybeSingle(),
                    supabase.from('facilities').select('*').order('order', { ascending: true }),
                    supabase.from('scholarships').select('*').order('order', { ascending: true }),
                    supabase.from('testimonials').select('*').order('order', { ascending: true }),
                    supabase.from('quick_links').select('*').order('order', { ascending: true }),
                    supabase.from('landing_gallery').select('*').order('order', { ascending: true }),
                ]);

                if (mounted) {
                    setData({
                        settings: settingsRes.data || {},
                        heroCards: heroCardsRes.data || [],
                        phases: phasesRes.data || [],
                        requirements: reqsRes.data || [],
                        pricing: pricingRes.data ? [pricingRes.data] : [],
                        facilities: facsRes.data || [],
                        scholarships: scholarsRes.data || [],
                        testimonials: testsRes.data || [],
                        quickLinks: linksRes.data || [],
                        gallery: galleryRes.data || [],
                        loading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                console.warn('Error fetching landing data:', err);
                if (mounted) {
                    setData(prev => ({ ...prev, loading: false, error: err }));
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    return data;
};
