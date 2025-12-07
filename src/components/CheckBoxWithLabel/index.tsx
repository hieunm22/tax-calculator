import { ChangeEvent } from "react"
import { FormControlLabel, Grid, Switch } from "@mui/material"
import TranslationText from "../TranslationText"
import { CheckBoxWithLabelProps } from "./types"
import "./switch.scss"

export const CheckBoxWithLabel = (props: CheckBoxWithLabelProps) => {
	const {
		disableEvent,
		enableEvent,
		id,
		isCheck,
		title,

		setCheck
	} = props

	const onSwitchChanged = (_: ChangeEvent<HTMLInputElement>, newValue: boolean) => {
		setCheck(newValue)
		if (newValue) {
			enableEvent && enableEvent()
		} else {
			disableEvent && disableEvent()
		}
	}

	return (
		<Grid className="usercp__text-row">
			<FormControlLabel
				id={id}
				label={<TranslationText text={title} />}
				labelPlacement="start"
				control={
					<Switch
						className="ios-switch"
						// focusVisibleClassName=".Mui-focusVisible"
						// disableRipple
						checked={isCheck}
						onChange={onSwitchChanged}
						slotProps={{
							input: { id, name: id }
						}}
					/>
				}
			/>
		</Grid>
	)
}
