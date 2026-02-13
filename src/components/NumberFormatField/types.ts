import type { JSX } from "react"
import { StringChanged } from "types/Common"

export interface NumberFormatProps {
	value?: string | number
	label: string
	end: JSX.Element | string
	handleUpdate?: StringChanged
	min?: number
	max?: number
}
