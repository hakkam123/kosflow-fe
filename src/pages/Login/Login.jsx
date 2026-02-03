import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button, Input } from '../../components';
import { useAuthStore } from '../../context';
import { APP_NAME, APP_TAGLINE } from '../../config/constants';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        const result = await login({ email });
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Logo and App Name */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-xl text-white text-2xl font-bold mb-4 shadow-lg shadow-primary-500/30">
                            K
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
                        <p className="text-gray-500 mt-1">{APP_TAGLINE}</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Admin
                            </label>
                            <Input
                                type="email"
                                placeholder="admin@kostanda.com"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3"
                            loading={isLoading}
                        >
                            Masuk dengan Email
                        </Button>
                    </form>

                    {/* Info Text */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Kode verifikasi akan dikirim ke email Anda
                    </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-primary-500/10 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

export default Login;