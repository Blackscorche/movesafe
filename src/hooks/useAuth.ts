import { useState, useCallback } from 'react';
import { authApi } from '../api/auth';
import { useAuthContext } from '../context/AuthContext';
import { isValidPhone, isValidEmail, isValidOTP } from '../utils/validators';

export const useAuth = () => {
  const { signIn, signOut, isAuthenticated, user, isLoading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOTP = useCallback(
    async (identifier: string, type: 'phone' | 'email', countryCode = '+58') => {
      setError(null);
      setIsSubmitting(true);
      try {
        if (type === 'phone' && !isValidPhone(identifier)) {
          setError('Número de teléfono inválido');
          return null;
        }
        if (type === 'email' && !isValidEmail(identifier)) {
          setError('Correo electrónico inválido');
          return null;
        }

        const response =
          type === 'phone'
            ? await authApi.requestOTPPhone(identifier, countryCode)
            : await authApi.requestOTPEmail(identifier);

        return response.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al enviar código');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const verifyOTP = useCallback(
    async (identifier: string, code: string, type: 'phone' | 'email') => {
      setError(null);

      if (!isValidOTP(code)) {
        setError('Código inválido — debe tener 6 dígitos');
        return null;
      }

      setIsSubmitting(true);
      try {
        const response = await authApi.verifyOTP(identifier, code, type);
        const { user, tokens } = response.data.data;
        await signIn(user, tokens);
        return response.data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Código incorrecto');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn]
  );

  const googleSignIn = useCallback(
    async (idToken: string) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const response = await authApi.googleSignIn(idToken);
        const { user, tokens } = response.data.data;
        await signIn(user, tokens);
        return response.data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error con Google');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn]
  );

  const appleSignIn = useCallback(
    async (identityToken: string) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const response = await authApi.appleSignIn(identityToken);
        const { user, tokens } = response.data.data;
        await signIn(user, tokens);
        return response.data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error con Apple');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn]
  );

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return {
    isAuthenticated,
    isLoading,
    isSubmitting,
    user,
    error,
    requestOTP,
    verifyOTP,
    googleSignIn,
    appleSignIn,
    logout,
    clearError: () => setError(null),
  };
};
