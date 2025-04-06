import { menuConfig } from "@/config/menu-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-300">
              © {currentYear} {menuConfig.siteName}. All rights reserved.
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1 transition-colors duration-300">
              Disclaimer: This toolkit is provided for educational purposes
              only.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
