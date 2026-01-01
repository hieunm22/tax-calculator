import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	Switch
} from "@mui/material"
import { COUNTRIES_DROPDOWN, LS_DARKMODE, LS_LANGUAGE } from "../../common/constants"
import { TTypography } from "../TranslationTag"
import { ComboBoxWithLabel } from "../ComboBoxWithLabel"
import { setDarkMode } from "toolkit/slice"
import i18n from "locales/i18n"
import { translate } from "locales/translate"
import useAutoTitle from "hooks/useAutoTitle"
import useToolkit from "hooks/useToolkit"
import "./NavBar.scss"

const Navbar = () => {
	const [language, changeLanguage] = useState("en")
	const [open, setOpen] = useState(false)
	const { state, dispatch } = useToolkit()
	useAutoTitle("home.header.label")

	useEffect(() => {
		if (open) {
			const lang = localStorage.getItem(LS_LANGUAGE) || "vi"
			changeLanguage(lang)
		}
	}, [open])

	const showSettings = (_: MouseEvent<HTMLElement>) => {
		setOpen(true)
	}

	useEffect(() => {
		const isDarkMode = localStorage.getItem(LS_DARKMODE) === "dark"
		dispatch(setDarkMode(isDarkMode))
	}, [])

	const onChangeLanguage = (e: ChangeEvent<HTMLInputElement>) => {
		changeLanguage(e.target.value)
		i18n.changeLanguage(e.target.value)
		localStorage.setItem(LS_LANGUAGE, e.target.value)
	}

	const toogleDarkMode = (e: ChangeEvent<HTMLElement>) => {
		e.stopPropagation()
		const isDarkMode = localStorage.getItem(LS_DARKMODE) === "dark"
		dispatch(setDarkMode(!isDarkMode))
		localStorage.setItem(LS_DARKMODE, isDarkMode ? "light" : "dark")
	}

	const handleClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
		if (reason === "escapeKeyDown") {
			setOpen(false)
		}
	}

	return (
		<>
			<div className="unauth-settings">
				<Button
					className="navbar-btn pull-right"
					onClick={showSettings}
					sx={{ px: 2 }}
					startIcon={<i className="fas fa-gear" />}
				>
					{translate("setting.header.label")}
				</Button>
			</div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle padding="5px 20px !important" width={350}>
					{translate("setting.header.label")}
				</DialogTitle>
				<Divider sx={{ my: "5px" }} />
				<DialogContent className="dialog-content">
					<Grid container className="setting-row">
						<TTypography content="setting.language.label" />
						<ComboBoxWithLabel
							id="language"
							options={COUNTRIES_DROPDOWN}
							value={language}
							change={onChangeLanguage}
						/>
					</Grid>
					<Grid container className="setting-row">
						<TTypography content="setting.darkmode.label" />
						<Switch
							className="ios-switch"
							checked={state.darkMode}
							onChange={toogleDarkMode}
						/>
					</Grid>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Button
							className="btn btn-primary mt-20 center"
							variant="outlined"
							onClick={() => setOpen(false)}
						>
							{translate("setting.btn-close.label")}
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Navbar
