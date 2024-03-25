import { useLocalStorage } from '@vueuse/core';
import { skipHydrate } from 'pinia';

export const useAuthStore = defineStore('authStore', () => {
  const token = useLocalStorage<any>('token', {});

  // other options...
  const signIn = async (payload: any) => {
    token.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        ...payload,
      },
    });

    return token;
  };

  const signUp = async (payload: any) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  };

  const resetPassword = async (payload: any) => {
    return await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  };

  const forgotPassword = async (email: string) => {
    return await $fetch('/api/auth/forget-password', {
      method: 'POST',
      body: {
        email,
      },
    });
  };

  return {
    signIn,
    signUp,
    token: skipHydrate(token),
    resetPassword,
    forgotPassword,
  };
});
