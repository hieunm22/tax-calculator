import { useState } from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { formatNumber } from "common/helper"
import { translate } from "locales/translate"
import type { NumberFormatProps } from "./types"

export default function NumberFormatField(props: NumberFormatProps & TextFieldProps) {
	const [syncedValue, setSyncedValue] = useState(props.value)
	const [displayValue, setDisplayValue] = useState(formatNumber(Number(props.value)))
	const [helpText, setHelpText] = useState("")
	const [realValue, setRealValue] = useState(props.value ? props.value.toString() : "")

	// re-sync from the parent during render when it pushes a new value
	if (props.value !== syncedValue) {
		setSyncedValue(props.value)
		if (props.value) {
			const formatValue = formatNumber(Number(props.value))
			setRealValue(props.value.toString())
			setDisplayValue(formatValue)
			setHelpText("")
		}
	}

	const showValue = (value: string) => {
		setDisplayValue(value)
		if (value !== "") setHelpText("")
	}

	const handleBlur = () => {
		const formatValue = formatNumber(Number(realValue))
		setDisplayValue(formatValue)
		setHelpText(!realValue ? "constant.is-required" : "")
		props.handleUpdate?.(realValue)
	}

	const unformat = (val: string) => val.replace(/\D/g, "")
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = unformat(e.target.value)
		const value = Number(raw)
		if (props.max !== undefined && value > props.max) return
		if (props.min !== undefined && raw !== "" && value < props.min) return
		setRealValue(raw)
		showValue(raw)
	}

	const handleFocus = () => {
		showValue(realValue)
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
				htmlInput: { pattern: "[0-9]*" }
			}}
		/>
	)
}
