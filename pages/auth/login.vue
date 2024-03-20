<script lang="ts" setup>
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});

const loginFormData = reactive({
  email: 'nguyenvietthoit@gmail.com',
  password: '123456',
});

const onSubmit = async () => {
  await authStore.signIn(loginFormData);
};
</script>

<template>
  <VeeForm class="space-y-6" v-slot="{ errors, meta }" @submit="onSubmit">
    <div>
      <label
        for="email"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Email</label
      >
      <div class="mt-2">
        <VeeField
          id="email"
          name="email"
          type="email"
          :rules="{
            required: true,
            // email: true,
          }"
          v-model="loginFormData.email"
          :class="[
            'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
            {
              'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.email,
            },
          ]"
        />
        <VeeErrorMessage name="email" class="mt-2 text-sm text-red-600" />
      </div>
    </div>
    <div>
      <label
        for="password"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Password</label
      >
      <div class="mt-2">
        <VeeField
          id="password"
          name="password"
          type="password"
          v-model="loginFormData.password"
          :class="[
            'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
            {
              'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
                errors.password,
            },
          ]"
        />
        <VeeErrorMessage name="password" class="mt-2 text-sm text-red-600" />
      </div>
    </div>
    <div>
      <button
        :disabled="!meta.valid"
        type="submit"
        :class="[
          'flex w-full justify-center rounded-md  px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          {
            'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600':
              meta.valid,
          },
          {
            'bg-indigo-300 hover:bg-indigo-300': !meta.valid,
          },
        ]"
      >
        Sign in
      </button>
    </div>
  </VeeForm>
  <p class="mt-6 text-center text-sm text-gray-500">
    Already a member?<NuxtLink
      class="text-blue-600 underline hover:text-blue-800"
      to="/auth/register"
    >
      Sign in now
    </NuxtLink>
  </p>
</template>
