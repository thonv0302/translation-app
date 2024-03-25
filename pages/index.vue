<template>
  <h1>Login</h1>

  <pre>{{ data }}</pre>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const data = ref<any>([]);

onMounted(async () => {
  test('/api/users');

  // data.value = await $fetch('/api/users', {
  //   headers: {
  //     authorization: 'Bearer ' + authStore.token.accessToken,
  //   },
  // });
});
// s
definePageMeta({
  layout: 'auth',
});
</script>
