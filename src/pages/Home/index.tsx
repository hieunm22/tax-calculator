import { useEffect, useState } from "react"
import {
	Box,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	Paper
} from "@mui/material"
import { INIT_TAX_CONFIG, LS_TAX_CONFIG } from "@/common/constants"
import { INSURANCE_RATE } from "./constants"
import NumberFormatField from "@/components/NumberFormatField"
import { TButton, TTypography } from "@/components/TranslationTag"
import { Settings } from "./components"
import { translate } from "@/locales/translate"
import { showPopup } from "@/toolkit/slice"
import useToolkit from "@/hooks/useToolkit"
import type { TaxConfig, TaxFormData } from "./types"
import "./Home.scss"

export default function Home() {
	const { dispatch } = useToolkit()
	const [formData, setFormData] = useState<TaxFormData>({
		income: "",
		dependents: "",
		contributionLevel: "official",
		contributionAmount: ""
	})
	const [taxConfig, setTaxConfig] = useState<TaxConfig>({} as TaxConfig)

	useEffect(() => {
		const taxConfigStr = localStorage.getItem(LS_TAX_CONFIG)
		if (taxConfigStr) {
			setTaxConfig(JSON.parse(taxConfigStr))
		} else {
			localStorage.setItem(LS_TAX_CONFIG, JSON.stringify(INIT_TAX_CONFIG))
			setTaxConfig(INIT_TAX_CONFIG)
		}
	}, [])

	const handleChange = (field: string) => (str: string) => {
		const clone = structuredClone(formData)
		clone[field as keyof TaxFormData] = str
		if (field === "income" && formData.contributionLevel === "official") {
			clone.contributionAmount = str
		}
		setFormData(clone)
	}

	const handleChangeRadio = (field: string) => (e: any) => {
		const clone = structuredClone(formData)
		clone[field as keyof TaxFormData] = e.target.value
		if (field === "contributionLevel" && e.target.value === "official") {
			clone.contributionAmount = clone.income
		} else if (field === "contributionLevel" && e.target.value === "other") {
			clone.contributionAmount = ""
		}
		setFormData(clone)
	}

	const handleShowSetting = () => {
		dispatch(showPopup(1))
	}

	const handleSubmit = () => {
		// prepare data
		const formNumbers = Object.values(formData)
			.map(Number)
			.filter((num) => !isNaN(num))
		const [totalIncome, dependents, contributionAmount] = formNumbers

		// calculate taxable income
		const taxableIncome =
			totalIncome -
			contributionAmount * INSURANCE_RATE -
			taxConfig.personalDeduction -
			dependents * taxConfig.dependantsDeduction

		if (taxableIncome <= 0) {
			alert(translate("home.answer.no-tax"))
			return
		}

		let remaining = taxableIncome
		let rate = 0
		let tax = 0
		let previousMax = 0

		for (const step of taxConfig.taxSteps) {
			if (remaining <= 0) break

			const taxableAtThisRate = Math.min(remaining, step.max - previousMax)
			tax += taxableAtThisRate * step.rate
			rate = step.rate

			remaining -= taxableAtThisRate
			previousMax = step.max
		}

		const totalTax = Math.round(tax)

		alert(
			`Thu nhập chịu thuế của bạn là: ${taxableIncome.toLocaleString()} ₫
mức bảo hiểm đã đóng là: ${(contributionAmount * INSURANCE_RATE).toLocaleString()} ₫
bạn thuộc mức thuế suất ${rate * 100}%
số thuế phải nộp là: ${totalTax.toLocaleString()} ₫
net income của bạn là : ${(totalIncome - contributionAmount * INSURANCE_RATE - totalTax).toLocaleString()} ₫`
		)
	}

	return (
		<Paper sx={{ px: 4, py: 2, width: "100%" }}>
			<TTypography
				variant="h5"
				sx={{ display: "flex", justifyContent: "center", mb: 4, fontWeight: 600 }}
				content="home.header.label"
			/>

			<Box
				sx={{
					display: "flex"
				}}
			>
				<Box width="100%">
					<NumberFormatField
						fullWidth
						label="home.income.label"
						placeholder="home.income.placeholder"
						end="₫"
						handleUpdate={handleChange("income")}
					/>
					<NumberFormatField
						fullWidth
						label="home.dependents.label"
						placeholder="home.dependents.placeholder"
						sx={{ my: 2 }}
						end={<i className="fa fa-user" />}
						handleUpdate={handleChange("dependents")}
					/>
				</Box>
			</Box>

			<Box sx={{ mb: 4 }}>
				<TTypography
					content="home.contribution-level.label"
					variant="subtitle1"
					sx={{ mb: 2, fontWeight: 500 }}
				/>
				<FormControl component="fieldset">
					<RadioGroup
						value={formData.contributionLevel}
						onChange={handleChangeRadio("contributionLevel")}
					>
						<FormControlLabel
							value="official"
							control={<Radio />}
							label={translate("home.contribution-level.offical")}
						/>
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
									placeholder="home.contribution-amount.placeholder"
									end="₫"
									handleUpdate={handleChange("contributionAmount")}
								/>
							)}
						</Box>
					</RadioGroup>
				</FormControl>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
				<TButton
					variant="contained"
					disabled={
						!formData.income ||
						!formData.dependents ||
						(formData.contributionLevel === "other" && !formData.contributionAmount)
					}
					onClick={handleSubmit}
					value="home.calculate-button.label"
				/>
				<TButton
					variant="outlined"
					onClick={handleShowSetting}
					value="home.setting-button.label"
				/>
			</Box>
			<Settings handleUpdateConfig={setTaxConfig} />
		</Paper>
	)
}
