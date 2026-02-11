import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../context';

const TIMER_DURATION = 60; // seconds

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, resendCode, isLoading, error, clearError } = useAuthStore();

    const email = location.state?.email || 'user@example.com';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(TIMER_DURATION);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const timerRef = useRef(null);

    // Start countdown timer
    const startTimer = useCallback(() => {
        setTimer(TIMER_DURATION);
        setCanResend(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTimer]);

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle individual digit input
    const handleChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').split('').slice(0, 6);
            const newCode = [...code];
            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });
            setCode(newCode);
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste on the container
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newCode = [...code];
            pastedData.split('').forEach((digit, i) => {
                newCode[i] = digit;
            });
            setCode(newCode);
            const nextIndex = Math.min(pastedData.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        const verificationCode = code.join('');
        if (verificationCode.length !== 6) return;

        const result = await verifyEmail({ email, code: verificationCode });
        if (result.success) {
            navigate('/login');
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        clearError();

        const result = await resendCode({ email });
        if (result.success) {
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            startTimer();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            Verifikasi Email
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
                            Masukkan kode 6 digit yang dikirim ke
                        </p>
                        <p className="text-gray-900 font-semibold text-sm">
                            {email}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Verification Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Code Input Boxes */}
                        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                                />
                            ))}
                        </div>

                        {/* Timer */}
                        {!canResend && (
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Kirim ulang kode dalam{' '}
                                <span className="font-semibold text-[#1a5c52]">
                                    {formatTime(timer)}
                                </span>
                            </p>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2 mb-6">
                            <button
                                type="submit"
                                disabled={isLoading || code.join('').length !== 6}
                                className="mx-auto block px-12 py-3 bg-[#1a5c52] hover:bg-[#164d45] text-white font-semibold rounded-full text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memverifikasi...
                                    </span>
                                ) : 'Verifikasi'}
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="text-center space-y-1">
                        <p className="text-sm text-gray-500">
                            Tidak menerima Kode?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={!canResend}
                            className={`text-sm font-semibold transition-colors ${canResend
                                ? 'text-gray-700 hover:text-[#059669] cursor-pointer'
                                : 'text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            Kirim Ulang Kode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
