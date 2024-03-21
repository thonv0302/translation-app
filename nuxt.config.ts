// https://nuxt.com/docs/api/configuration/nuxt-config
import { env } from 'node:process';
// @ts-ignore
import * as process from 'process';
const sw = process.env.SW === 'true';
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    strategies: sw ? 'injectManifest' : 'generateSW',
    srcDir: sw ? 'service-worker' : undefined,
    filename: sw ? 'sw.ts' : undefined,
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Vite PWA',
      short_name: 'NuxtVitePWA',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
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
