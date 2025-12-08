import React from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { translate } from "../../locales/translate"
import type { NumberFormatProps } from "./types"

export default function NumberFormatField(props: NumberFormatProps & TextFieldProps) {
	const [displayValue, setDisplayValue] = React.useState("")
	const [helpText, setHelpText] = React.useState("")
	const [realValue, setRealValue] = React.useState("")

	React.useEffect(() => {
		if (props.value) {
			setRealValue(props.value.toString())

			const formatValue = formatNumber(Number(props.value))
			setDisplayValue(formatValue)
		}
	}, [props.value])

	const formatNumber = (num: number) => {
		if (!num) return ""
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

	const handleBlur = () => {
		const formatValue = formatNumber(Number(realValue))
		setDisplayValue(formatValue)
		setHelpText(!realValue ? "constant.is-required" : "")
		props.handleUpdate && props.handleUpdate(realValue)
	}

	const unformat = (val: string) => val.replace(/\D/g, "")
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = unformat(e.target.value)
		setRealValue(raw)
		setDisplayValue(raw)
	}

	const handleFocus = () => {
		setDisplayValue(realValue)
	}

	return (
		<TextField
			fullWidth={props.fullWidth}
			required
			type="text"
			disabled={props.disabled}
			label={translate(props.label)}
			placeholder={translate(props.placeholder)}
			value={displayValue}
			onBlur={handleBlur}
			helperText={translate(helpText)}
			error={!!helpText}
			onChange={handleChange}
			onFocus={handleFocus}
			size="small"
			variant="standard"
			sx={props.sx}
			slotProps={{
				input: {
					style: { minWidth: 250 },
					inputMode: "numeric",
					endAdornment: props.end
				},
				htmlInput: {}
			}}
		/>
	)
}
