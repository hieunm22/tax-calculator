import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LS_LANGUAGE } from "common/constants"

export default function useAutoTitle(titleKey: string) {
	const { i18n, t } = useTranslation()

	useEffect(() => {
		const lsLang = localStorage.getItem(LS_LANGUAGE)
		const isValidLang = lsLang && ["en", "vi", "jp", "kr", "cn"].includes(lsLang)
		if (isValidLang) {
			i18n.changeLanguage(lsLang)
		} else {
			localStorage.setItem(LS_LANGUAGE, "en")
			i18n.changeLanguage("en")
		}
	}, [])

	useEffect(() => {
		const setTranslatedTitle = () => {
			document.title = t(titleKey)
		}

		setTranslatedTitle()

		i18n.on("languageChanged", setTranslatedTitle)

		return () => {
			i18n.off("languageChanged", setTranslatedTitle)
		}
	}, [i18n, t, titleKey])
}
