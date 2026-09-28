import { useEffect, useState } from "react"
import { LS_TAX_CONFIG, TAX_CONFIGS } from "common/constants"

/** selected tax policy, restored from and persisted to local storage. */
export function useTaxIndex() {
	const [taxIndex, setTaxIndex] = useState(() => {
		const stored = Number(localStorage.getItem(LS_TAX_CONFIG))
		return TAX_CONFIGS[stored] ? stored : 1
	})

	useEffect(() => {
		localStorage.setItem(LS_TAX_CONFIG, taxIndex.toString())
	}, [taxIndex])

	return [taxIndex, setTaxIndex] as const
}
