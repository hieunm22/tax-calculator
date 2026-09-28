import { EmptyVoid } from "types/Common"

export interface CheckBoxWithLabelProps {
	isCheck: boolean
	disabled: boolean
	id: string // prefix of style
	title: string // label
	setCheck: (value: boolean) => void
	enableEvent?: EmptyVoid
	disableEvent?: EmptyVoid
}
