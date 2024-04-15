export {};

declare global {
  interface Window {
    google: any;
    fbAsyncInit: any;
    FB: any;
  }
}

declare module '#app' {
  interface NuxtApp {
    $cb(response: string): any;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $cb(response: string): any;
  }
}
