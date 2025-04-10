import { CardGrid } from "./card-grid"
import { menuConfig } from "@/config/menu-config"

export function ContentCards() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-100">
        {menuConfig.siteName} - 开发者工具集
      </h2>
      <CardGrid showOnlyBookmarked={true} />
    </div>
  )
}
