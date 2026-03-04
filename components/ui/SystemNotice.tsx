import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type NoticeVariant = 'success' | 'danger' | 'info';

interface SystemNoticeProps {
    open: boolean;
    variant?: NoticeVariant;
    title: string;
    message: string;
    onClose: () => void;
    autoCloseMs?: number;
}

export const SystemNotice: React.FC<SystemNoticeProps> = ({
    open,
    variant = 'info',
    title,
    message,
    onClose,
    autoCloseMs,
}) => {
    useEffect(() => {
        if (open && autoCloseMs) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseMs);
            return () => clearTimeout(timer);
        }
    }, [open, autoCloseMs, onClose]);

    const styleMap = {
        success: {
            bg: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            titleColor: "text-green-800",
            msgColor: "text-green-700",
            Icon: CheckCircle2
        },
        danger: {
            bg: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            titleColor: "text-red-800",
            msgColor: "text-red-700",
            Icon: XCircle
        },
        info: {
            bg: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
            titleColor: "text-blue-800",
            msgColor: "text-blue-700",
            Icon: Info
        }
    };

    const { bg, iconColor, titleColor, msgColor, Icon } = styleMap[variant];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-6 sm:top-auto sm:bottom-6 right-6 sm:right-6 z-[120] min-w-[320px] max-w-sm pointer-events-auto"
                >
                    <div className={`p-4 rounded-xl border shadow-lg ${bg} flex gap-3 relative`}>
                        <Icon className={`${iconColor} mt-0.5 shrink-0`} size={20} />
                        <div className="flex-1 pr-6">
                            <h4 className={`text-sm font-bold ${titleColor}`}>{title}</h4>
                            <p className={`text-sm ${msgColor} mt-0.5`}>{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`absolute top-4 right-4 ${iconColor} opacity-50 hover:opacity-100 transition-opacity`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
