import { useEffect, useState } from "react"
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Paper,
	SxProps,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme
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

	const sxValue = { p: 1, color: "text.secondary", textAlign: "right" } as SxProps<Theme>

	return (
		<Dialog
			open={state.activePopup === 1}
			onClose={handleClose}
			sx={{
				'& .MuiDialog-paper': {
					borderRadius: 3,
					margin: "0 10px",
				},
			}}
		>
			<DialogTitle className="dialog-title" padding="5px 20px !important" width={350}>
				{translate("config.policy.label" + (taxIndex + 1))}
			</DialogTitle>
			<Divider sx={{ my: "5px", overflowY: "scroll" }} />
			<DialogContent className="dialog-content">
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "13fr 7fr",
					}}
				>
					<Box sx={{ p: 1 }}>
						{translate("config.personal-deduction.label")}
					</Box>
					<Box sx={sxValue}>
						{formatNumber(configData.personalDeduction)} ₫
					</Box>

					<Box sx={{ p: 1 }}>
						{translate("config.dependants-deduction.label")}
					</Box>
					<Box sx={sxValue}>
						{formatNumber(configData.dependantsDeduction)} ₫
					</Box>

					<Box sx={{ p: 1 }}>
						{translate("config.minimum-insurance.label")}
					</Box>
					<Box sx={sxValue}>
						{insuranceBase}
					</Box>

					<Box sx={{ p: 1 }}>
						{translate("config.insurance-rate.label")}
					</Box>
					<Box sx={sxValue}>
						{insuranceRate}
					</Box>
				</Box>

				<Box>
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
			</DialogContent>
			<DialogActions sx={{
				display: "flex",
				justifyContent: "center"
			}}>
				<TButton
					variant="outlined"
					onClick={() => handleClose(null, "escapeKeyDown")}
					value="config.close.label"
				/>
			</DialogActions>
		</Dialog>
	)
}
