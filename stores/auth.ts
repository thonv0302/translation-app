import { useLocalStorage } from '@vueuse/core';
import { skipHydrate } from 'pinia';

export const useAuthStore = defineStore('authStore', () => {
  const authToken = useLocalStorage<any>('token', {});

  // other options...
  const signIn = async (payload: any) => {
    authToken.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        ...payload,
      },
    });

    return authToken;
  };

  const signUp = async (payload: any) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  };

  const signInWithGoogle = async (token: any) => {
    authToken.value = await $fetch('/api/auth/google', {
      method: 'POST',
      body: {
        token,
      },
    });
  };

  const signInWithFacebook = async (accessToken: any) => {
    authToken.value = await $fetch('/api/auth/faceobook', {
      method: 'POST',
      body: {
        accessToken,
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
    token: skipHydrate(authToken),
    resetPassword,
    forgotPassword,
    signInWithGoogle,
    signInWithFacebook,
  };
});
