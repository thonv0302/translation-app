<script lang="ts" setup>
const router = useRouter();

const authStore = useAuthStore();

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
  layout: 'default',
});
</script>

<template>
  <div class="flex items-center">
    <button @click="router.go(-1)" class="p-2">
      <Icon class="w-6 h-6" name="material-symbols:arrow-back-rounded" />
    </button>
    <h1 class="text-2xl font-bold text-gray">Tra Từ</h1>
  </div>
</template>
