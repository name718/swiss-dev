import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = never
declare module "../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_less@4.2_738efdeac2d18322a778e0b4115a2556/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}