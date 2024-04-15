export default defineNuxtPlugin({
  name: 'facebook-oauth',
  parallel: true,
  async setup(nuxtApp) {
    const {
      public: { facebookApuId },
    } = useRuntimeConfig();

    const loadFacebookAuthLibrary = () => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.fbAsyncInit = function () {
          window.FB.init({
            cookie: true,
            xfbml: true,
            appId: facebookApuId,
            version: 'v19.0',
          });
          window.FB.AppEvents.logPageView();
        };
      };
      document.head.appendChild(script);
    };
    loadFacebookAuthLibrary();
  },
});
