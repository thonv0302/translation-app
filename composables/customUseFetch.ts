export async function test(url: string) {
  const authStore = useAuthStore();

  const data = await useFetch(url, {
    onRequest({ request, options }) {
      // Set the request headers
      options.headers = options.headers || {};
      options.headers.authorization = 'Bearer ' + authStore.token.accessToken;
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
    },
    onResponse({ request, response, options }) {
      // Process the response data
      // localStorage.setItem('token', response._data.token);
      // console.log('response: ', response);
    },
    async onResponseError({ request, response, options }) {
      // Handle the response errors
      if (response.status === 401) {
        // useFetch(url, {
        const data = await $fetch('/api/auth/refresh-token', {
          method: 'POST',
          body: {
            refreshToken: authStore.token.refreshToken,
          },
        });
        authStore.token = data;
        test(url);
        console.log('data: ', data);

        // })
      }
    },
  });
}
