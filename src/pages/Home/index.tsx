import { FocusEvent, useEffect, useState } from "react"
import {
	Box,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Paper,
	Select,
	MenuItem
} from "@mui/material"
import { TAX_CONFIGS, LS_TAX_CONFIG } from "common/constants"
import { useAlert } from "components/AlertProvider"
import NumberFormatField from "components/NumberFormatField"
import { TButton, TI, TTextField, TTypography } from "components/TranslationTag"
import { Settings } from "./components"
import { translate } from "locales/translate"
import { showPopup } from "toolkit/slice"
import useAutoTitle from "hooks/useAutoTitle"
import useToolkit from "hooks/useToolkit"
import { calcGross, calcTaxInNet } from "./common"
import "common/helper"
import type { TaxConfig, TaxFormData } from "./types"
import "./Home.scss"

export default function Home() {
	const { dispatch } = useToolkit()
	const alertPopup = useAlert()
	const [taxIndex, setTaxIndex] = useState<number>(1)
	const [taxConfig, setTaxConfig] = useState<TaxConfig>(TAX_CONFIGS[taxIndex])
	const [formData, setFormData] = useState<TaxFormData>({
		income: "",
		dependents: "",
		contributionLevel: "other",
		targetType: "net",
		contributionAmount: taxConfig.minimumInsuranceBase.toString()
	})
	const [helpText, setHelpText] = useState<string>("")
	useAutoTitle("home.header.label")

	useEffect(() => {
		const taxConfigStr = localStorage.getItem(LS_TAX_CONFIG)
		if (taxConfigStr && Number.isInteger(taxConfigStr)) {
			setTaxIndex(Number(taxConfigStr))
		} else {
			localStorage.setItem(LS_TAX_CONFIG, "1")
		}
	}, [])

	useEffect(() => {
		const newTaxConfig = TAX_CONFIGS[taxIndex]
		setTaxConfig(newTaxConfig)
		localStorage.setItem(LS_TAX_CONFIG, taxIndex.toString())

		const clone = structuredClone(formData)
		if (formData.contributionLevel === "other")
			clone.contributionAmount = newTaxConfig.minimumInsuranceBase.toString()
		else if (formData.contributionLevel === "official")
			clone.contributionAmount = clone.income
		setFormData(clone)
	}, [taxIndex])

	const handleChange = (field: string) => (str: string) => {
		const clone = structuredClone(formData)
		clone[field as keyof TaxFormData] = str
		if (field === "income" && formData.contributionLevel === "official") {
			clone.contributionAmount = str
		}
		setFormData(clone)
	}

	const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
		setHelpText(!e.target.value ? "constant.is-required" : "")
		const clone = structuredClone(formData)
		clone.dependents = e.target.value
		setFormData(clone)
	}

	const handleChangeRadio = (field: string) => (e: any) => {
		const clone = structuredClone(formData)
		clone[field as keyof TaxFormData] = e.target.value
		if (field === "contributionLevel" && e.target.value === "official") {
			clone.contributionAmount = clone.income
		} else if (field === "contributionLevel" && e.target.value === "other") {
			clone.contributionAmount = taxConfig.minimumInsuranceBase.toString()
		}

		setFormData(clone)
	}

	const handleShowSetting = () => {
		dispatch(showPopup(1))
	}

	const submitNet = async () => {
		// prepare data
		const formNumbers = Object.values(formData)
			.map(Number)
			.filter(num => !isNaN(num))
		const [totalIncome, dependents, contributionAmount] = formNumbers
		const totalDeductions = taxConfig.personalDeduction + dependents * taxConfig.dependantsDeduction
		const insuranceAmount = contributionAmount * taxConfig.insuranceRate

		// calculate taxable income
		const taxableIncome = totalIncome - insuranceAmount - totalDeductions
		const taxInNet = calcTaxInNet(taxableIncome, taxConfig)
		const net = totalIncome - insuranceAmount - taxInNet

		await alertPopup(
			`${translate("home.answer.row-1").formatWithNumber(totalIncome)}
${translate("home.answer.row-2").formatWithNumber(insuranceAmount)}
${translate("home.answer.row-3").formatWithNumber(totalIncome - insuranceAmount)}
${translate("home.answer.row-4").formatWithNumber(totalIncome - insuranceAmount - totalDeductions)}
${translate("home.answer.row-5").formatWithNumber(taxInNet)}
${translate("home.answer.row-6").formatWithNumber(net)}`
		)
	}

	const submitGross = async () => {
		// prepare data
		const formNumbers = Object.values(formData)
			.map(Number)
			.filter(num => !isNaN(num))
		const [netSalary, dependents, contributionAmount] = formNumbers

		// calculate gross salary
		const gross = calcGross(netSalary, dependents, contributionAmount, taxConfig)
		const insuranceAmount = contributionAmount * taxConfig.insuranceRate
		const totalDeductions = taxConfig.personalDeduction + dependents * taxConfig.dependantsDeduction

		await alertPopup(
			`${translate("home.answer.row-1").formatWithNumber(gross)}
${translate("home.answer.row-2").formatWithNumber(insuranceAmount)}
${translate("home.answer.row-3").formatWithNumber(gross - insuranceAmount)}
${translate("home.answer.row-4").formatWithNumber(gross - insuranceAmount - totalDeductions)}
${translate("home.answer.row-5").formatWithNumber(gross - insuranceAmount - netSalary)}
${translate("home.answer.row-6").formatWithNumber(netSalary)}`
		)
	}

	return (
		<Paper className="main-content">
			<TTypography variant="h5" className="header" content="home.header.label" />

			<Box sx={{ display: "flex" }}>
				<Box width="100%">
					<NumberFormatField
						fullWidth
						label="home.income.label"
						placeholder="home.income.placeholder"
						end="₫"
						handleUpdate={handleChange("income")}
					/>
					<TTextField
						fullWidth
						variant="standard"
						label="home.dependents.label"
						placeholder="home.dependents.placeholder"
						type="number"
						sx={{ my: 2 }}
						error={!!helpText}
						helperText={translate(helpText)}
						slotProps={{
							input: {
								endAdornment: <i className="fa fa-user" />,
							},
							htmlInput: { min: 0, max: 24, step: 1 }
						}}
						onBlur={handleBlur}
					/>
				</Box>
			</Box>

			<Box sx={{ mb: 2 }}>
				<TTypography
					content="home.contribution-level.label"
					variant="subtitle1"
					sx={{ mb: 1, fontWeight: 500 }}
				/>
				<FormControl component="fieldset">
					<RadioGroup
						value={formData.contributionLevel}
						onChange={handleChangeRadio("contributionLevel")}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<FormControlLabel
								value="other"
								control={<Radio />}
								label={translate("home.contribution-level.other")}
							/>
							{formData.contributionLevel === "other" && (
								<NumberFormatField
									value={formData.contributionAmount}
									label="home.contribution-amount.label"
									placeholder={translate(
										"home.contribution-amount.placeholder"
									).formatWithNumber(taxConfig.minimumInsuranceBase)}
									end="₫"
									handleUpdate={handleChange("contributionAmount")}
								/>
							)}
						</Box>
						<FormControlLabel
							value="official"
							control={<Radio />}
							label={translate("home.contribution-level.official")}
						/>
					</RadioGroup>
				</FormControl>
			</Box>

			<Box sx={{ mb: 2 }}>
				<TTypography
					content="config.policy.label"
					variant="subtitle1"
					sx={{ mb: 1, fontWeight: 500 }}
				/>
				<Select
					size="medium"
					sx={{ minWidth: "calc(100% - 52px)" }}
					variant="standard"
					labelId="dropdown-label"
					value={taxIndex}
					onChange={e => setTaxIndex(e.target.value)}
				>
					<MenuItem value={0}>{translate("config.policy.label1")}</MenuItem>
					<MenuItem value={1}>{translate("config.policy.label2")}</MenuItem>
					<MenuItem value={2}>{translate("config.policy.label3")}</MenuItem>
				</Select>
				<TI
					className="far fa-info-circle info"
					title="config.policy.tooltip"
					onClick={handleShowSetting}
				/>
			</Box>

			<Box sx={{ mb: 2 }}>
				<TTypography content="home.target-type.label" variant="subtitle1" />
				<FormControl component="fieldset">
					<RadioGroup
						sx={{ flexDirection: "row" }}
						value={formData.targetType}
						onChange={handleChangeRadio("targetType")}
					>
						<FormControlLabel
							value="net"
							control={<Radio />}
							label={translate("home.target-type.net")}
						/>
						<FormControlLabel
							value="gross"
							control={<Radio />}
							label={translate("home.target-type.gross")}
						/>
					</RadioGroup>
				</FormControl>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					justifyContent: "center",
					gap: 2
				}}
			>
				<TButton
					startIcon={<i className="fa fa-calculator" />}
					variant="contained"
					disabled={
						!formData.income ||
						!formData.dependents ||
						(formData.contributionLevel === "other" && !formData.contributionAmount)
					}
					onClick={formData.targetType === "net" ? submitNet : submitGross}
					value={formData.targetType === "net" ? "GROSS → NET" : "NET → GROSS"}
				/>
			</Box>
			<Settings />
		</Paper>
	)
}
