<script setup lang="ts">
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 w-full h-screen">
    <div
      class="col-span-1 md:col-span-4 p-2 md:p-4 lg:p-8 xl:p-16 md:flex md:items-center"
    >
      <div class="w-full">
        <div class="flex">
          <button @click="router.go(-1)">
            <Icon class="w-6 h-6" name="material-symbols:arrow-back-rounded" />
          </button>
          <h2
            v-if="route.name === 'auth-login' || route.name === 'auth-register'"
            class="ms-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Sign {{ route.name === 'auth-login' ? 'in' : 'up' }} to your account
          </h2>
          <h2
            v-else-if="route.name === 'auth-reset-password-resetToken'"
            class="ms-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Reset password
          </h2>
          <h2
            v-else
            class="ms-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Forgot password
          </h2>
        </div>
        <slot />
      </div>
    </div>
    <div class="hidden md:block md:col-span-8">
      <!-- Right part content goes here -->
      <!-- This part is hidden on mobile and takes 8/12 width on desktop -->
    </div>
  </div>
</template>

<style scoped></style>
