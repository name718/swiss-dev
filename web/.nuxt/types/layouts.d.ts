import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = string
declare module "../../../node_modules/.pnpm/nuxt@3.16.1_@parcel+watcher@2.5.1_@types+node@22.13.13_db0@0.3.1_ioredis@5.6.0_lightningcss@1_ewsogftpzrzz6ffikhnmwbotzq/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}