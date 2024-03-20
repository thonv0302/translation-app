export const useAuthStore = defineStore('authStore', () => {
  // other options...
  const signIn = async (payload: any) => {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  };

  const signUp = async (payload: any) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        ...payload,
      },
    });
  };

  return {
    signIn,
    signUp,
  };
});
