import { Fragment } from 'react';
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
    show: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmModal({
    show,
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Hapus',
    cancelText = 'Batal',
    danger = true,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop with Blur */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all w-full max-w-md border border-slate-100">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    aria-label="Tutup modal"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row gap-4">
                                    {/* Icon Badge */}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        danger
                                            ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm shadow-red-500/10'
                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-500/10'
                                    }`}>
                                        {danger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 sm:mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors focus:outline-none"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all focus:outline-none ${
                                            danger
                                                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/25 active:scale-95'
                                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 active:scale-95'
                                        }`}
                                    >
                                        {danger && <Trash2 className="w-4 h-4" />}
                                        <span>{confirmText}</span>
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

