import { useMemo } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import {
	createTheme,
	CssBaseline,
	ThemeProvider,
	type PaletteMode
} from "@mui/material"
import { AlertProvider } from "./components/AlertProvider"
import PublicRoute from "./components/PublicRoute"
import Home from "./pages/Home"
import useToolkit from "./hooks/useToolkit"
import "./style/responsive.scss"

function App() {
	const { state } = useToolkit()
	const mode: PaletteMode = state.darkMode ? "dark" : "light"

	const theme = useMemo(
		() =>
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
					mode
				}
			}),
		[mode]
	)

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
