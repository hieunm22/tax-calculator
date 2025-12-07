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
	taxSteps: TaxStep[]
}
