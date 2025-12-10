export {}

declare global {
	interface Date {
		addHours(hour: number): Date
	}

	interface String {
		format(...args: string[]): string
		formatWithNumber(...args: number[]): string
	}
}
