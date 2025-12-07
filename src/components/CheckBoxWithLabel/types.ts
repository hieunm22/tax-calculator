export interface CheckBoxWithLabelProps {
	isCheck: boolean
	disabled: boolean
	id: string // prefix of style
	title: string // label
	setCheck: (value: boolean) => void
	enableEvent?: Function
	disableEvent?: Function
}
