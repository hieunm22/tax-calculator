import { useEffect, useState } from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { translate } from "locales/translate"
import { formatNumber } from "common/helper"
import type { NumberFormatProps } from "./types"

export default function NumberFormatField(props: NumberFormatProps & TextFieldProps) {
	const [displayValue, setDisplayValue] = useState("")
	const [helpText, setHelpText] = useState("")
	const [realValue, setRealValue] = useState("")

	useEffect(() => {
		if (props.value) {
			setRealValue(props.value.toString())

			const formatValue = formatNumber(Number(props.value))
			setDisplayValue(formatValue)
		}
	}, [props.value])

	useEffect(() => {
		if (displayValue !== "") {
			setHelpText("")
		}
	}, [displayValue])

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
				htmlInput: { pattern: "[0-9]*" }
			}}
		/>
	)
}
