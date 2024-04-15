<script setup>
const authStore = useAuthStore();
const router = useRouter();

const initiateFBLogin = () => {
  FB.login(
    (response) => {
      if (response.authResponse) {
        authStore
          .signInWithFacebook(response.authResponse.accessToken)
          .then(() => {
            router.push({ name: 'index' });
          });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    },
    { scope: 'email,public_profile', return_scopes: true }
  );
};
</script>

<template>
  <button
    @click="initiateFBLogin"
    class="w-[40px] h-[40px] flex border rounded items-center justify-center"
  >
    <img src="/public/icons/facebook.svg" class="w-5 h-5" />
  </button>
</template>
