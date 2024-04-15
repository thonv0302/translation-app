export default defineNuxtPlugin({
  name: 'google-oauth',
  parallel: true,
  async setup(nuxtApp) {
    const {
      public: { googleClientId1 },
    } = useRuntimeConfig();
    const authStore = useAuthStore();
    const router = useRouter();

    const loadGoogleAuthLibrary = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: googleClientId1,
          callback: handleCredentialResponse,
        });
      };
      document.head.appendChild(script);
    };
    loadGoogleAuthLibrary();

    const handleCredentialResponse = (response: any) => {
      authStore.signInWithGoogle(response.credential);
      router.push({
        name: 'index',
      });
      // Here you can send the ID token to your backend to validate and create a session
    };
  },
});
