/// <reference types="vitest" />
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
	plugins: [react()],
	build: {
		target: "esnext",
		rollupOptions: {}
	},
	server: {
		port: 3000
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
