import { FocusEvent, useEffect, useState } from "react"
import {
	Box,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Paper,
	Select,
	MenuItem,
	InputLabel,
	FormLabel
} from "@mui/material"
import { TAX_CONFIGS, LS_TAX_CONFIG } from "common/constants"
import { useAlert } from "components/AlertProvider"
import NumberFormatField from "components/NumberFormatField"
import { TButton, TI, TTextField, TTypography } from "components/TranslationTag"
import { ContributionAmountInput, Settings } from "./components"
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
	const [taxIndex, setTaxIndex] = useState<number>(-1)
	const [taxConfig, setTaxConfig] = useState<TaxConfig>(TAX_CONFIGS[1])
	const [formData, setFormData] = useState<TaxFormData>({
		income: "",
		dependents: "",
		contributionLevel: "other",
		targetType: "net",
		contributionRate: "99",
		contributionAmount: taxConfig.minimumInsuranceBase.toString()
	})
	const [helpText, setHelpText] = useState<string>("")
	useAutoTitle("home.header.label")

	useEffect(() => {
		const taxConfigStr = localStorage.getItem(LS_TAX_CONFIG)
		if (taxConfigStr && /^\d$/.test(taxConfigStr)) {
			setTaxIndex(Number(taxConfigStr))
			return
		}

		setTaxIndex(1)
		localStorage.setItem(LS_TAX_CONFIG, "1")
	}, [])

	useEffect(() => {
		const newTaxConfig = TAX_CONFIGS[taxIndex]
		if (!newTaxConfig) return
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
		if (field === "contributionRate" && formData.contributionLevel === "rate") {
			const amount = (Number(formData.income) * Number(str) / 100).toString()
			clone.contributionAmount = amount
		}
		setFormData(clone)
	}

	const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
		setHelpText(!e.target.value ? "constant.is-required" : "")
		const clone = structuredClone(formData)
		clone.dependents = e.target.value
		setFormData(clone)
	}

	const handleChangeLevel = (field: string) => (e: any) => {
		const clone = structuredClone(formData)
		clone[field as keyof TaxFormData] = e.target.value
		if (field === "contributionLevel" && e.target.value === "official" && formData.income) {
			clone.contributionAmount = clone.income
		} else if (field === "contributionLevel") {
			if (e.target.value === "other") {
				clone.contributionAmount = taxConfig.minimumInsuranceBase.toString()
			} else if (e.target.value === "rate") {
				clone.contributionAmount = (Number(formData.income) * Number(formData.contributionRate) / 100).toString()
			} else if (e.target.value === "official" && formData.income) {
				clone.contributionAmount = clone.income
			}
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
		const [totalIncome, dependents, contributionRate, contributionAmount] = formNumbers
		const totalDeductions = taxConfig.personalDeduction + dependents * taxConfig.dependantsDeduction
		const realContributionAmount = formData.contributionLevel === "rate"
			? totalIncome * (contributionRate / 100)
			: contributionAmount
		const insuranceAmount = realContributionAmount * taxConfig.insuranceRate

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
		const [netSalary, dependents, contributionRate, contributionAmount] = formNumbers

		// calculate gross salary
		const gross = calcGross(netSalary, dependents, contributionAmount, taxConfig)
		const realContributionAmount = formData.contributionLevel === "rate"
			? netSalary * (contributionRate / 100)
			: contributionAmount
		const insuranceAmount = realContributionAmount * taxConfig.insuranceRate
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
						end={<i className="far fa-dong-sign" />}
						handleUpdate={handleChange("income")}
					/>
					<TTextField
						fullWidth
						variant="standard"
						label="home.dependents.label"
						placeholder="home.dependents.placeholder"
						type="number"
						sx={{ my: 1 }}
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

			<Box sx={{ mb: 1 }}>
				<FormControl
					fullWidth
					size="small"
					variant="outlined"
				>
					<InputLabel id="contribution-level-label" sx={{ ml: -1.6, my: 1 }}>
						{translate("home.contribution-level.label")}
					</InputLabel>
					<Select
						size="medium"
						fullWidth
						variant="standard"
						disabled={!formData.income}
						labelId="dropdown-label"
						value={formData.contributionLevel}
						onChange={handleChangeLevel("contributionLevel")}
					>
						<MenuItem value="other">{translate("home.contribution-level.other")}</MenuItem>
						<MenuItem value="official">{translate("home.contribution-level.official")}</MenuItem>
						<MenuItem value="rate">{translate("home.contribution-level.rate")}</MenuItem>
					</Select>
				</FormControl>
				<ContributionAmountInput
					formData={formData}
					handleChange={handleChange}
					taxConfig={taxConfig}
				/>
			</Box>

			<Box sx={{ mb: 2 }}>
				<FormControl
					sx={{ minWidth: "calc(100% - 36px)" }}
					size="small"
					variant="outlined"
				>
					<InputLabel id="contribution-level-label" sx={{ ml: -1.6, my: 1 }}>
						{translate("config.policy.label")}
					</InputLabel>
					<Select
						size="medium"
						variant="standard"
						labelId="dropdown-label"
						value={taxIndex}
						onChange={e => setTaxIndex(e.target.value)}
					>
						<MenuItem value={0}>{translate("config.policy.label1")}</MenuItem>
						<MenuItem value={1}>{translate("config.policy.label2")}</MenuItem>
						<MenuItem value={2}>{translate("config.policy.label3")}</MenuItem>
					</Select>
				</FormControl>
				<TI
					className="far fa-info-circle info"
					title="config.policy.tooltip"
					onClick={handleShowSetting}
					style={{ marginTop: 20 }}
				/>
			</Box>

			<Box sx={{ mb: 2 }}>
				<FormControl>
					<FormLabel id="contribution-level-label"
						sx={{
							fontSize: "0.75rem",
							color: "text.secondary",
							"&.Mui-focused": {
								color: "primary.main",
							}
						}}
					>
						{translate("config.policy.label")}
					</FormLabel>
					<RadioGroup
						sx={{ flexDirection: "row" }}
						value={formData.targetType}
						onChange={handleChangeLevel("targetType")}
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
