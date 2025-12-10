import { TaxConfig, TaxStep } from "./types"

export function calcTaxInNet(taxableIncome: number, config: TaxConfig): number {
	let remaining = taxableIncome
	let rate = 0
	let tax = 0
	let previousMax = 0

	for (const step of config.taxSteps) {
		if (remaining <= 0) break

		const taxableAtThisRate = Math.min(remaining, step.max - previousMax)
		tax += taxableAtThisRate * step.rate
		rate = step.rate

		remaining -= taxableAtThisRate
		previousMax = step.max
	}

	const totalTax = Math.round(tax)
	return totalTax
}

export function calcGross(
	net: number,
	dependents: number,
	siBase: number,
	config: TaxConfig
): number {
	const employeeSI = siBase * config.insuranceRate

	const totalDeductions =
		config.personalDeduction + dependents * config.dependantsDeduction

	// Net = TI + totalDeductions - PIT(TI)
	const netAfterDeductions = net - totalDeductions
	if (netAfterDeductions <= 0) {
		return net + employeeSI
	}

	const taxableIncome = invertTaxableIncome(netAfterDeductions, config.taxSteps)

	// gross = taxableIncome + employeeSI + totalDeductions
	const gross = taxableIncome + employeeSI + totalDeductions

	// optional: ensure no negative values
	return Math.max(0, Math.round(gross))
}

function invertTaxableIncome(netAfterDeductions: number, brackets: TaxStep[]): number {
	// calculate tax below each bracket
	const cumTaxBelow: number[] = [0]
	for (let i = 0; i < brackets.length - 1; i++) {
		const b = brackets[i]
		const span = b.max - (brackets[i - 1]?.max ?? 0)
		cumTaxBelow[i + 1] = cumTaxBelow[i] + span * b.rate

		const r = b.rate
		const Tbelow = cumTaxBelow[i]
		const ti = (netAfterDeductions + Tbelow - r * (brackets[i - 1]?.max ?? 0)) / (1 - r)

		const within =
			ti >= (brackets[i - 1]?.max ?? 0) - 1e-6 &&
			ti < (isFinite(b.max) ? b.max + 1e-6 : Infinity)

		if (within) return Math.max(0, ti)
	}

	// edge case: use last bracket
	const last = brackets[brackets.length - 1]
	const r = last.rate
	const Tbelow = cumTaxBelow[cumTaxBelow.length - 1]
	const ti =
		(netAfterDeductions + Tbelow - r * brackets[brackets.length - 2].max) / (1 - r)
	return Math.max(0, ti)
}
