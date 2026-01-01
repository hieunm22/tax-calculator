import { useMemo } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import {
	createTheme,
	CssBaseline,
	ThemeProvider,
	type PaletteMode
} from "@mui/material"
import { LS_DARKMODE } from "./common/constants"
import { AlertProvider } from "./components/AlertProvider"
import PublicRoute from "./components/PublicRoute"
import Home from "./pages/Home"
import useToolkit from "./hooks/useToolkit"
import "./style/responsive.scss"

function App() {
	const darkMode = localStorage.getItem(LS_DARKMODE) || "dark"
	const { state } = useToolkit()

	const createThemeCallback = () =>
		createTheme({
			typography: {
				fontSize: 14
			},
			components: {
				MuiButton: {
					styleOverrides: {
						root: {
							textTransform: "none"
						}
					}
				},
				MuiInputBase: {
					styleOverrides: {
						root: {
							fontSize: "14px"
						}
					}
				},
				MuiListItemText: {
					styleOverrides: {
						primary: {
							fontSize: "14px"
						}
					}
				}
			},
			palette: {
				mode: darkMode as PaletteMode
			}
		})

	const theme = useMemo(createThemeCallback, [state.darkMode])

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route element={<PublicRoute />}>
						<Route
							path="/"
							element={
								<AlertProvider>
									<Home />
								</AlertProvider>
							}
						/>
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	)
}

export default App
