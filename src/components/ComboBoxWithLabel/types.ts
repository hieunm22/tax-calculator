import { ChangeEvent, FocusEventHandler } from "react"
import { DropdownProps } from "types/Common"

export interface ComboBoxWithLabelProps {
	id: string
	title?: string
	options: DropdownProps[]
	value: string
	errorMessage?: string
	blur?: FocusEventHandler<HTMLInputElement>
	change?: (e: ChangeEvent<HTMLInputElement>) => void
}
