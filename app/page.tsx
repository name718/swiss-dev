import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContentCards } from "@/components/content-cards"
import { ThemeProvider } from "@/components/theme-provider"
import { menuConfig } from "@/config/menu-config"

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={menuConfig.settings.darkMode ? "dark" : "light"}
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 transition-all duration-300">
            <ContentCards />
          </main>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

