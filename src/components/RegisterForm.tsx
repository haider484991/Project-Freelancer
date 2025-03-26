'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register as registerUser } from '../store/slices/authSlice';
import { useRouter } from 'next/navigation';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Form validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.email')).required(t('validation.required')),
    password: yup
      .string()
      .min(6, t('validation.minLength', { count: 6 }))
      .required(t('validation.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('auth.passwordMismatch'))
      .required(t('validation.required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
      
      // Registration successful
      setRegistrationSuccess(true);
      reset();
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('common.register')}</h2>
      
      {registrationSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {t('auth.registrationSuccessful')}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            {t('common.name')}
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            {t('common.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            {t('common.password')}
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            {t('common.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </span>
          ) : (
            t('common.register')
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 