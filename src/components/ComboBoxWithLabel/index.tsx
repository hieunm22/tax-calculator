import {
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import { translate } from "../../locales/translate"
import TranslationText from "../../components/TranslationText"
import { ComboBoxWithLabelProps } from "./types"
import "./ComboBoxWithLabel.scss"

export const ComboBoxWithLabel = (props: ComboBoxWithLabelProps) => {
	const handleChange = (e: any) => {
		props.change?.(e)
	}

	return (
		<Grid sx={{ padding: "0 30px" }}>
			<FormControl fullWidth variant="standard" error={!!props.errorMessage}>
				{props.title && (
					<InputLabel>
						<TranslationText text={props.title} />
					</InputLabel>
				)}
				<Select
					name={props.id}
					labelId="language-label"
					value={props.value}
					onBlur={props.blur}
					onChange={handleChange}
				>
					{props.options.map(option => (
						<MenuItem key={option.key} value={option.key} disabled={option.disabled}>
							{option.icon && (
								<img className="dropdown-flag" src={option.icon} alt={option.value} />
							)}
							{translate(option.value)}
						</MenuItem>
					))}
				</Select>
				<FormHelperText>{props.errorMessage}</FormHelperText>
			</FormControl>
		</Grid>
	)
}
