import { useEffect, useState } from "react"
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@mui/material"
import { TAX_CONFIGS, LS_LANGUAGE, LS_TAX_CONFIG } from "common/constants"
import { TButton, TSpan, TTypography } from "components/TranslationTag"
import { translate } from "locales/translate"
import i18n from "locales/i18n"
import useToolkit from "hooks/useToolkit"
import { showPopup } from "toolkit/slice"
import { formatNumber } from "common/helper"
import { TaxConfig } from "./types"

export const Settings = () => {
	const { state, dispatch } = useToolkit()
	const [taxIndex, setTaxIndex] = useState<number>(1)
	const [configData, setConfigData] = useState<TaxConfig>(TAX_CONFIGS[1])

	useEffect(() => {
		if (state.activePopup === 1) {
			const lang = localStorage.getItem(LS_LANGUAGE) || "en"
			i18n.changeLanguage(lang)

			const taxConfigLS = localStorage.getItem(LS_TAX_CONFIG)
			if (!taxConfigLS) {
				localStorage.setItem(LS_TAX_CONFIG, "1")
				setTaxIndex(1)
				setConfigData(TAX_CONFIGS[1])
			} else {
				setConfigData(TAX_CONFIGS[+taxConfigLS])
				setTaxIndex(+taxConfigLS)
			}
		}
	}, [state.activePopup])

	const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
		if (reason === "escapeKeyDown") {
			dispatch(showPopup(0))
		}
	}

	const insuranceBase = formatNumber(configData.minimumInsuranceBase) + " ₫"
	const insuranceRate = configData.insuranceRate * 100 + " %"

	return (
		<Dialog open={state.activePopup === 1} onClose={handleClose}>
			<DialogTitle padding="5px 20px !important" width={350}>
				{translate("config.policy.label" + (taxIndex + 1))}
			</DialogTitle>
			<Divider sx={{ my: "5px" }} />
			<DialogContent className="dialog-content">
				<FormControlLabel
					label={<TSpan className="label-constant" content="config.personal-deduction.label" />}
					labelPlacement="start"
					sx={{ mb: 1 }}
					control={
						<Typography sx={{ ml: 2, color: "text.secondary" }}>
							{formatNumber(configData.personalDeduction)} ₫
						</Typography>
					}
				/>
				<br />
				<FormControlLabel
					label={<TSpan className="label-constant" content="config.dependants-deduction.label" />}
					labelPlacement="start"
					sx={{ mb: 1 }}
					control={
						<Typography sx={{ ml: 2, color: "text.secondary" }}>
							{formatNumber(configData.dependantsDeduction)} ₫
						</Typography>
					}
				/>
				<br />
				<FormControlLabel
					label={<TSpan className="label-constant" content="config.minimum-insurance.label" />}
					labelPlacement="start"
					sx={{ mb: 1 }}
					control={
						<Typography sx={{ ml: 2, color: "text.secondary" }}>
							{insuranceBase}
						</Typography>
					}
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
					<TableContainer component={Paper}>
						<Table
							size="small"
							sx={{
								borderCollapse: "collapse",
								"& th, & td": {
									border: "1px solid",
									borderColor: "divider",
								},
							}}
						>
							<TableHead>
								<TableRow>
									<TableCell align="center" width={100}>{translate("config.tax-level.label")}</TableCell>
									<TableCell align="center" width={250}>{translate("config.tax-step.label")}</TableCell>
									<TableCell align="center" width={180}>{translate("config.tax-rate.label")}</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{configData.taxSteps.map((step, index) => (
									<TableRow key={index}>
										<TableCell align="center">{index + 1}</TableCell>
										<TableCell align="right">{formatNumber(step.max)} ₫</TableCell>
										<TableCell align="right">{step.rate * 100} %</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>

				<Box sx={{
						display: "flex",
						justifyContent: "center",
						flexDirection: { xs: "column", sm: "row" },
						gap: 1
					}}
				>
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
