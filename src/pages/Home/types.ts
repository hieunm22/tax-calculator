export interface TaxFormData {
	income: string
	dependents: string
	contributionLevel: string
	contributionAmount: string
}

export interface TaxBracketsProps {
	max: number
	rate: number
}

interface TaxStep {
	max: number
	rate: number
}

export interface TaxConfig {
	personalDeduction: number
	dependantsDeduction: number
	insuranceRate: number
	taxSteps: TaxStep[]
}

export interface UpdateTaxConfig {
	handleUpdateConfig: (config: TaxConfig) => void
}
