import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

export default defineConfig({
	base: process.env.BASE_PATH ?? "/",
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "icon.svg"],
			manifest: {
				name: "Tax Calculator",
				short_name: "Tax Calculator",
				description: "Personal income tax and insurance calculator",
				theme_color: "#1976d2",
				background_color: "#ffffff",
				display: "standalone",
				// must match base when deploying under a sub path, e.g. /tax-calculator/
				start_url: "/",
				// must match base when deploying under a sub path, e.g. /tax-calculator/
				scope: "/",
				icons: [
					{ src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
					{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				]
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
				// must be prefixed with base when deploying under a sub path, e.g. /tax-calculator/index.html
			navigateFallback: "/index.html",
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "cdn-assets",
							expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	],
	build: {
		target: "esnext",
		rollupOptions: {}
	},
	server: {
		port: 3001,
		host: "0.0.0.0"
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"react-i18next/dist/es/IcuTransUtils": "react-i18next/dist/es/IcuTransUtils.js",
			"react-i18next/dist/es/IcuTransWithoutContext":
				"react-i18next/dist/es/IcuTransWithoutContext.js",
			components: path.resolve(__dirname, "./src/components"),
			common: path.resolve(__dirname, "./src/common"),
			hooks: path.resolve(__dirname, "./src/hooks"),
			locales: path.resolve(__dirname, "./src/locales"),
			pages: path.resolve(__dirname, "./src/pages"),
			toolkit: path.resolve(__dirname, "./src/toolkit"),
			types: path.resolve(__dirname, "./src/types")
		}
	}
})
