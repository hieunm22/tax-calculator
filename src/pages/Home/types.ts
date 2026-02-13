export interface TaxFormData {
	income: string
	dependents: string
	contributionLevel: string
	contributionAmount: string
	contributionRate: string
	targetType: string
}

export interface TaxStep {
	max: number
	rate: number
}

export interface TaxConfig {
	personalDeduction: number
	dependantsDeduction: number
	insuranceRate: number
	minimumInsuranceBase: number
	taxSteps: TaxStep[]
}

export interface ContributionAmountProps {
	formData: TaxFormData
	handleChange: (field: keyof TaxFormData) => (value: string) => void
	taxConfig: TaxConfig
}
