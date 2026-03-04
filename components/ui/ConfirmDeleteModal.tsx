import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    open: boolean;
    title?: string;
    message?: string;
    itemLabel?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    open,
    title = "Hapus data ini?",
    message = "Tindakan ini tidak bisa dibatalkan. Data akan dihapus permanen dari sistem.",
    itemLabel,
    confirmText = "Ya, Hapus",
    cancelText = "Batal",
    onConfirm,
    onCancel,
}) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onCancel();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[100]"
                        onClick={handleCancel}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 z-[101] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="bg-cream-100 max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100 pointer-events-auto"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex space-x-4">
                                        <div className="bg-red-100 text-red-600 rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {message}
                                            </p>
                                            {itemLabel && (
                                                <div className="mt-3 p-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-800">
                                                    {itemLabel}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white disabled:opacity-50 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus:ring-2 focus:ring-gray-200 outline-none"
                                        autoFocus
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] transition-colors focus:ring-2 focus:ring-red-300 outline-none"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                                Menghapus...
                                            </>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
