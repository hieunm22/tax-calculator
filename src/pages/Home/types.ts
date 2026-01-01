export interface TaxFormData {
	income: string
	dependents: string
	contributionLevel: string
	contributionAmount: string
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
