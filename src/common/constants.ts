import { TaxConfig } from "pages/Home/types"

export const COUNTRIES_DROPDOWN = [
	{
		key: "en",
		icon: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1fa-1f1f8.svg",
		value: "English"
	},
	{
		key: "vi",
		icon: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1fb-1f1f3.svg",
		value: "Tiếng Việt (Vietnamese)"
	},
	{
		key: "jp",
		icon: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1ef-1f1f5.svg",
		value: "日本語 (Japanese)"
	},
	{
		key: "kr",
		icon: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1f0-1f1f7.svg",
		value: "한국인 (Korean)"
	},
	{
		key: "cn",
		icon: "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f1e8-1f1f3.svg",
		value: "中国人 (Chinese)",
		disabled: true
	}
]
export const LS_DARKMODE = "dark-mode"
export const LS_LANGUAGE = "language"
export const LS_TAX_CONFIG = "tax-config"

const INIT_TAX_CONFIG_07: TaxConfig = {
	personalDeduction: 9000000,
	dependantsDeduction: 3600000,
	insuranceRate: 0.105,
	minimumInsuranceBase: 5310000,
	taxSteps: [
		{ max: 5000000, rate: 0.05 },
		{ max: 10000000, rate: 0.1 },
		{ max: 18000000, rate: 0.15 },
		{ max: 32000000, rate: 0.2 },
		{ max: 52000000, rate: 0.25 },
		{ max: 80000000, rate: 0.3 },
		{ max: 20000000000, rate: 0.35 }
	]
}

const INIT_TAX_CONFIG_20: TaxConfig = {
	personalDeduction: 11000000,
	dependantsDeduction: 4400000,
	insuranceRate: 0.105,
	minimumInsuranceBase: 5310000,
	taxSteps: [
		{ max: 5000000, rate: 0.05 },
		{ max: 10000000, rate: 0.1 },
		{ max: 18000000, rate: 0.15 },
		{ max: 32000000, rate: 0.2 },
		{ max: 52000000, rate: 0.25 },
		{ max: 80000000, rate: 0.3 },
		{ max: 20000000000, rate: 0.35 }
	]
}

const INIT_TAX_CONFIG_25: TaxConfig = {
	personalDeduction: 15500000,
	dependantsDeduction: 6200000,
	insuranceRate: 0.105,
	minimumInsuranceBase: 5310000,
	taxSteps: [
		{ max: 10000000, rate: 0.05 },
		{ max: 30000000, rate: 0.1 },
		{ max: 60000000, rate: 0.2 },
		{ max: 100000000, rate: 0.3 },
		{ max: 20000000000, rate: 0.35 }
	]
}

export const TAX_CONFIGS: TaxConfig[] = [
	INIT_TAX_CONFIG_07,
	INIT_TAX_CONFIG_20,
	INIT_TAX_CONFIG_25
]
