import { EmptyVoid } from "types/Common"

interface AlertOptions {
	title?: string
	okText?: string
}

export interface AlertRequest {
	message: string
	options?: AlertOptions
	resolve: EmptyVoid
}

export interface AlertModalProps {
	open: boolean
	title: string
	message: string
	onClose: EmptyVoid
}

export type AlertFn = (message: string, options?: AlertOptions) => Promise<void>
