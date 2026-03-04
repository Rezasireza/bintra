import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.warn("Supabase Connection Error:", error.message);
        } else {
            console.log("Supabase OK");
        }
    } catch (err) {
        console.warn("Supabase Check Failed:", err);
    }
};
