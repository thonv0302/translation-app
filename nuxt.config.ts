// https://nuxt.com/docs/api/configuration/nuxt-config
import { env } from 'node:process';
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  plugins: ['~/plugins/vee-validate/index.ts'],
  runtimeConfig: {
    auth: {
      jwtTokenSecret: env.JWT_TOKEN_SECRET,
      jwtTokenExpirySeconds: Number(
        env.JWT_ACCESS_TOKEN_TTL ?? 21 * 24 * 60 * 60
      ),
    },
    public: {
      auth: {
        authCookieName: 'nuxtess_token',
      },
    },
  },
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        port: Number(env.REDIS_PORT),
        host: env.REDIS_HOST,
      },
    },
  },
});
