export {}

declare global {
	interface Date {
		addHours(hour: number): Date
	}

	interface String {
		format(...args: any): string
	}

	interface ImportMetaEnv {
		readonly NODE_ENV: string
		readonly VITE_AZURE_ACCOUNT: string
		readonly VITE_BACKEND_BASE_URL: string
		readonly VITE_FACEBOOK_CLIENT_ID: string
		readonly VITE_GOOGLE_CLIENT_ID: string
		readonly VITE_MICROSOFT_CLIENT_ID: string
		readonly VITE_OPENAI_API_KEY: string
		readonly VITE_PUBLIC_DISTRIBUTION: string
		readonly VITE_SOCKET: string
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv
	}
}
