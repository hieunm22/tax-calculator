import type { Theme } from "@emotion/react"
import type { SxProps } from "@mui/material"
import type { JSX } from "react"

export interface NumberFormatProps {
	fullWidth?: boolean
	value?: string | number
	label: string
	sx?: SxProps<Theme>
	placeholder?: string
	end: JSX.Element | string
	handleUpdate: (str: string) => void
}
