// Generated by Nuxt'
import type { Plugin } from '#app'

type Decorate<T extends Record<string, any>> = { [K in keyof T as K extends string ? `$${K}` : never]: T[K] }

type InjectionType<A extends Plugin> = A extends {default: Plugin<infer T>} ? Decorate<T> : unknown

type NuxtAppInjections = 
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/revive-payload.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/head/runtime/plugins/unhead.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/pages/runtime/plugins/router.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/browser-devtools-timing.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/navigation-repaint.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/check-outdated-build.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/revive-payload.server.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/chunk-reload.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/pages/runtime/plugins/prefetch.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/pages/runtime/plugins/check-if-page-unused.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/@nuxt+devtools@2.3.1_vite@6.2.3_@types+node@22.13.13_jiti@2.4.2_less@4.2.2_lightningcss_9a70e3340b7f38dd2344fa141e8c54ec/node_modules/@nuxt/devtools/dist/runtime/plugins/devtools.server.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/@nuxt+devtools@2.3.1_vite@6.2.3_@types+node@22.13.13_jiti@2.4.2_less@4.2.2_lightningcss_9a70e3340b7f38dd2344fa141e8c54ec/node_modules/@nuxt/devtools/dist/runtime/plugins/devtools.client.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/dev-server-logs.js")> &
  InjectionType<typeof import("../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/app/plugins/check-if-layout-used.js")> &
  InjectionType<typeof import("../../plugins/fontawesome.js")>

declare module '#app' {
  interface NuxtApp extends NuxtAppInjections { }

  interface NuxtAppLiterals {
    pluginName: 'nuxt:revive-payload:client' | 'nuxt:head' | 'nuxt:router' | 'nuxt:browser-devtools-timing' | 'nuxt:revive-payload:server' | 'nuxt:chunk-reload' | 'nuxt:global-components' | 'nuxt:prefetch' | 'nuxt:checkIfPageUnused' | 'vue-devtools-client' | 'nuxt:checkIfLayoutUsed'
  }
}

declare module 'vue' {
  interface ComponentCustomProperties extends NuxtAppInjections { }
}

export { }
