export {}

declare global {
	interface Date {
		addHours(hour: number): Date
	}

	interface String {
		format(...args: any): string
	}
}
