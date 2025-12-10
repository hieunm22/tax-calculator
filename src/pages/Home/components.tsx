import { useEffect, useState } from "react"
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel
} from "@mui/material"
import { INIT_TAX_CONFIG, LS_LANGUAGE, LS_TAX_CONFIG } from "common/constants"
import { TButton, TSpan, TTypography } from "components/TranslationTag"
import NumberFormatField from "components/NumberFormatField"
import { translate } from "locales/translate"
import i18n from "locales/i18n"
import useToolkit from "hooks/useToolkit"
import { showPopup } from "toolkit/slice"
import { TaxConfig, UpdateTaxConfig } from "./types"

export const Settings = (props: UpdateTaxConfig) => {
	const { state, dispatch } = useToolkit()
	const [configData, setConfigData] = useState<TaxConfig>(INIT_TAX_CONFIG)

	useEffect(() => {
		if (state.activePopup === 1) {
			const lang = localStorage.getItem(LS_LANGUAGE) || "en"
			i18n.changeLanguage(lang)

			const taxConfigLS = localStorage.getItem(LS_TAX_CONFIG)
			const taxConfig = taxConfigLS ? JSON.parse(taxConfigLS) : null
			if (!taxConfig || taxConfig.taxSteps.length === 0) {
				localStorage.setItem(LS_TAX_CONFIG, JSON.stringify(INIT_TAX_CONFIG))
				setConfigData(INIT_TAX_CONFIG)
			} else {
				setConfigData(taxConfig)
			}
		}
	}, [state.activePopup])

	const handleChange = (field: string) => (value: string) => {
		const clone = structuredClone(configData)
		if (field === "personalDeduction") {
			clone.personalDeduction = +value
		} else if (field === "dependantsDeduction") {
			clone.dependantsDeduction = +value
		} else if (field.startsWith("taxSteps")) {
			const match = field.match(/taxSteps\[(\d+)\]\.(rate|max)/)
			if (match) {
				const index = Number(match[1]) - 1
				if (index >= 0 && index < clone.taxSteps.length) {
					const step = clone.taxSteps[index]
					if (field.endsWith("max")) {
						step.max = +value
					} else {
						step.rate = +value / 100
					}
				}
			}
		}
		setConfigData(clone)
	}

	const handleRemoveStep = (index: number) => {
		const clone = structuredClone(configData)
		const steps = clone.taxSteps.filter((_, i) => i !== index)
		clone.taxSteps = steps
		setConfigData(clone)
	}

	const handleSave = () => {
		localStorage.setItem(LS_TAX_CONFIG, JSON.stringify(configData))
		props.handleUpdateConfig(configData)
		dispatch(showPopup(0))
	}

	const handleReset = () => {
		localStorage.setItem(LS_TAX_CONFIG, JSON.stringify(INIT_TAX_CONFIG))
		props.handleUpdateConfig(INIT_TAX_CONFIG)
	}

	const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
		if (reason === "escapeKeyDown") {
			dispatch(showPopup(0))
		}
	}

	const insuranceBase =
		configData.minimumInsuranceBase.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
		" ₫"
	const insuranceRate = configData.insuranceRate * 100 + " %"

	return (
		<Dialog open={state.activePopup === 1} onClose={handleClose}>
			<DialogTitle padding="5px 20px !important" width={350}>
				{translate("setting.header.label")}
			</DialogTitle>
			<Divider sx={{ my: "5px" }} />
			<DialogContent className="dialog-content">
				<NumberFormatField
					fullWidth
					value={configData.personalDeduction}
					label="config.personal-deduction.label"
					placeholder="config.personal-deduction.placeholder"
					sx={{ mb: 1 }}
					end="₫"
					handleUpdate={handleChange("personalDeduction")}
				/>
				<NumberFormatField
					fullWidth
					value={configData.dependantsDeduction}
					label="config.dependants-deduction.label"
					placeholder="config.dependants-deduction.placeholder"
					sx={{ mb: 1 }}
					end="₫"
					handleUpdate={handleChange("dependantsDeduction")}
				/>
				<FormControlLabel
					label={
						<TSpan className="label-constant" content="config.minimum-insurance.label" />
					}
					labelPlacement="start"
					control={
						<TTypography
							sx={{ ml: 2, color: "text.secondary" }}
							content={insuranceBase}
						/>
					}
					sx={{ mb: 1 }}
				/>
				<br />
				<FormControlLabel
					label={
						<TSpan className="label-constant" content="config.insurance-rate.label" />
					}
					labelPlacement="start"
					control={
						<TTypography
							sx={{ ml: 2, color: "text.secondary" }}
							content={insuranceRate}
						/>
					}
					sx={{ mb: 1 }}
				/>

				<Box sx={{ mb: 2 }}>
					{configData.taxSteps.map((step, index) => (
						<Box key={index} sx={{ display: "flex", justifyContent: "space-arround" }}>
							<NumberFormatField
								value={step.max}
								label={`config.tax-step-${index + 1}.label`}
								placeholder={`config.tax-step-${index + 1}.label`}
								end="₫"
								handleUpdate={handleChange(`taxSteps[${index + 1}].max`)}
							/>
							&nbsp;&nbsp;
							<NumberFormatField
								value={step.rate * 100}
								label={`config.tax-rate-${index + 1}.label`}
								placeholder={`config.tax-rate-${index + 1}.label`}
								end="%"
								handleUpdate={handleChange(`taxSteps[${index + 1}].rate`)}
							/>
							<div className="remove-step">
								<i
									className="fas fa-times icon"
									onClick={() => handleRemoveStep(index)}
								/>
							</div>
						</Box>
					))}
				</Box>

				<Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
					<TButton
						variant="contained"
						onClick={handleSave}
						startIcon={<i className="far fa-save" />}
						value="config.save.label"
					/>
					<TButton
						variant="outlined"
						color="info"
						startIcon={<i className="fas fa-undo" />}
						onClick={handleReset}
						value="config.default.label"
					/>
					<TButton
						variant="outlined"
						onClick={() => handleClose(null, "escapeKeyDown")}
						value="config.close.label"
					/>
				</Box>
			</DialogContent>
		</Dialog>
	)
}
