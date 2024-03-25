<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const resetPassword = reactive({
  password: '123456',
  passwordConfirm: '123456',
});

const onSubmit = async () => {
  try {
    await authStore.resetPassword({
      ...resetPassword,
      resetToken: route.params.resetToken,
    });
    // router.push({
    //   name: 'index',
    // });
  } catch (error) {}
};
</script>

<template>
  <VeeForm class="space-y-6" v-slot="{ errors, meta }" @submit="onSubmit">
    <div>
      <label
        for="new-password"
        class="block text-sm font-medium leading-6 text-gray-900"
        >New Password</label
      >
      <div class="mt-2">
        <VeeField
          id="new-password"
          name="new-password"
          type="password"
          :rules="{
            required: true,
            minLength: 6,
          }"
          v-model="resetPassword.password"
          :class="[
            'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
            {
              'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
                errors['new-password'],
            },
          ]"
        />
        <VeeErrorMessage
          name="new-password"
          class="mt-2 text-sm text-red-600"
        />
      </div>
    </div>
    <div>
      <label
        for="confirm-new-password"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Confirm New Password</label
      >
      <div class="mt-2">
        <VeeField
          id="confirm-new-password"
          name="confirm-new-password"
          type="password"
          v-model="resetPassword.passwordConfirm"
          rules="required|minLength:6|confirmed:@new-password"
          :class="[
            'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
            {
              'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
                errors['confirm-new-password'],
            },
          ]"
        />
        <VeeErrorMessage
          name="confirm-new-password"
          class="mt-2 text-sm text-red-600"
        />
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
        Reset
      </button>
    </div>
  </VeeForm>
</template>
