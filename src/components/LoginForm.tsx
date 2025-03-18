"use client";
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    // For now, we'll just simulate a login and navigate to dashboard
    // In a real app, you'd make an API call here
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-[40px] lg:gap-[76px] w-full">
      {/* Logo and Title */}
      <div className="flex flex-col gap-[5px]">
        <h1 className="font-michael text-primary text-[45px] lg:text-[55px] uppercase tracking-[0.04em] leading-none font-bold">FITTRACK</h1>
        <p className="font-manrope font-semibold text-[16px] lg:text-[20px] text-white tracking-[0.04em] capitalize">fitness & nutrition tracking</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-[40px] lg:gap-[62px]">
        {/* Header */}
        <div className="flex flex-col gap-[6px] lg:gap-[6.21px]">
          <h2 className="font-manrope font-bold text-[32px] lg:text-[40px] text-white leading-[44px] lg:leading-[55px]">Login</h2>
          <p className="font-manrope font-medium text-[16px] lg:text-[20px] text-white leading-[22px] lg:leading-[27px]">Login to access your travelwise account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-[40px] lg:gap-[50px]">
          <div className="flex flex-col gap-[20px] lg:gap-[25px] w-full">
            {/* Email Input */}
            <div className="bg-white text-black rounded-[60px] px-[25px] lg:px-[29px] py-[16px] lg:py-[20px] flex items-center">
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="w-full bg-transparent outline-none text-black text-[16px] lg:text-[18px] font-medium leading-[22px] lg:leading-[25px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-[12px] lg:gap-[18px] w-full">
              <div className="bg-white text-black rounded-[60px] px-[25px] lg:px-[29px] py-[16px] lg:py-[20px] flex justify-between items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter Your Password" 
                  className="w-full bg-transparent outline-none text-black text-[16px] lg:text-[18px] font-medium leading-[22px] lg:leading-[25px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.76094 5.29498C10.4597 5.10498 11.2022 5 12.0001 5C16.9093 5 21.0001 12 21.0001 12C21.0001 12 20.1662 13.4002 18.7782 14.8002" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.2195 16.2749C13.5308 16.7552 12.7552 17 12 17C7.09076 17 3 10 3 10C3 10 4.40757 7.74984 6.78183 6.01092" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 3L21 21" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-right text-white font-medium text-[16px] lg:text-[18px] leading-[22px] lg:leading-[25px] cursor-pointer">Forgot Password ?</p>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className="bg-primary text-white rounded-[60px] py-[16px] lg:py-[20px] px-[25px] lg:px-[29px] text-[16px] lg:text-[18px] font-semibold w-full mt-[25px] lg:mt-[35px] flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Register Link */}
            <p className="text-white font-medium text-[16px] lg:text-[18px] text-center leading-[22px] lg:leading-[25px]">Don't have an account?</p>
          </div>

          {/* Social Login */}
          <div className="flex flex-col items-center gap-[20px] lg:gap-[25px]">
            {/* Divider with "Or login with" text */}
            <div className="flex items-center w-full">
              <div className="flex-grow h-[1px] bg-[#C2C2C2]"></div>
              <div className="mx-4 text-[#E6E6E6] font-medium text-[16px] lg:text-[18px] leading-[22px] lg:leading-[25px]">Or login with</div>
              <div className="flex-grow h-[1px] bg-[#C2C2C2]"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-[16px] justify-center">
              {/* Facebook Button */}
              <button type="button" className="bg-white rounded-full w-[55px] h-[55px] lg:w-[116px] lg:h-[68px] flex items-center justify-center p-[16px] lg:px-[40px]">
                <div className="relative w-[24px] h-[24px] lg:w-[36px] lg:h-[36px]">
                  <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 26.9843 6.5823 34.431 15.1875 35.7812V23.2031H10.6172V18H15.1875V14.0344C15.1875 9.52312 17.8749 7.03125 22.0864 7.03125C23.9552 7.03125 26.0156 7.38281 26.0156 7.38281V11.8125H23.7459C21.51 11.8125 20.8125 13.2001 20.8125 14.625V18H25.8047L25.0066 23.2031H20.8125V35.7812C29.4177 34.431 36 26.9843 36 18Z" fill="#3C5A9A"/>
                  </svg>
                </div>
              </button>

              {/* Google Button */}
              <button type="button" className="bg-white rounded-full w-[55px] h-[55px] lg:w-[110px] lg:h-[62px] flex items-center justify-center p-[16px] lg:px-[40px]">
                <div className="relative w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]">
                  <svg className="w-full h-full" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.7075 15.3455C29.7075 14.3259 29.6249 13.3008 29.4485 12.2976H15.3V18.0739H23.4021C23.066 19.9368 21.9856 21.5848 20.4038 22.632V26.3799H25.2375C28.076 23.7674 29.7075 19.9093 29.7075 15.3455Z" fill="#4285F4"/>
                    <path d="M15.3001 30.001C19.3458 30.001 22.7574 28.6728 25.2431 26.3799L20.4094 22.632C19.0646 23.5469 17.3284 24.065 15.3056 24.065C11.3924 24.065 8.07433 21.4249 6.88381 17.8754H1.8958V21.739C4.44214 26.8043 9.62863 30.001 15.3001 30.001Z" fill="#34A853"/>
                    <path d="M6.87816 17.8754C6.24984 16.0124 6.24984 13.9951 6.87816 12.1322V8.26868L1.89061 8.26868C-0.231888 12.507 -0.231888 17.5005 1.89061 21.739L6.87816 17.8754Z" fill="#FBBC05"/>
                    <path d="M15.3001 5.93708C17.4386 5.904 19.5055 6.70871 21.0543 8.18584L25.3369 3.90328C22.6251 1.35688 19.0261 -0.0430825 15.3001 0.00101083C9.62863 0.00101083 4.44214 3.19778 1.8958 8.26868L6.88335 12.1322C8.0658 8.57217 11.3918 5.93708 15.3001 5.93708Z" fill="#EB4335"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 