import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';

const UserLoginOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/user/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Mobile Container Mockup */}
      <div className="w-full max-w-[450px] bg-white min-h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        
        {/* Header/Banner Area */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Akses Penghuni</h1>
            <p className="text-primary-100 text-sm">Masukkan kode OTP yang dikirimkan oleh pengelola kos untuk masuk ke dashboard Anda.</p>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-500 block text-center">Kode OTP 6-Digit</label>
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    required
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full py-6 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 group"
                disabled={isLoading || otp.some(v => v === '')}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Masuk Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button className="text-sm text-primary-600 font-semibold hover:underline">
              Kirim ulang kode?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center border-t border-slate-50">
          <p className="text-xs text-slate-400">
            &copy; 2024 KosFlow Management System. <br/> Keamanan data Anda adalah prioritas kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginOTP;
